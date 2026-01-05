Challenge de Interbanking

## Objetivo

Este proyecto implementa APIs que permitan gestionar información sobre empresas, la adhesión de las mismas y sus transferencias. 

## Arquitectura

Se utilizó arquitectura Hexagonal para mantener la lógica de negocio independiente de frameworks y detalles técnicos. La estructura del proyecto es la siguiente:  

- **domain**: entidades y reglas de negocio
- **application**: casos de uso y definición de ports
- **adapters**: adaptadores de entrada (HTTP controllers) y de salida (Pesistencia JSON file)  

## Domain
### Empresa (Company)
Representa una empresa cliente de la entidad financiera.

### Adhesión (CompanyAdhesion)
Representa el momento en que una empresa establece una relación contractual con el banco y queda habilitada para operar en el sistema.

Se considera una sola adhesión por empresa. Podría tratarse como un atributo tipo fecha, pero se modela como un **Value Object** para que pueda escalar a entidad si el dominio lo requiere mas adelante.

### Transferencias (CompanyTransfer)
Representa una operación bancaria realizada por una empresa adherida.
Para este ejercicio se lo modeló como un **Value Object** pero podría considerarse evolucionar hacia una entidad.


## Adapters
### Controllers
Actúan como adaptadores de entrada y son responsables de orquestar la interacción entre los request y los casos de uso.

### Persistencia
Se implementa mediante un archivo JSON como adaptador de salida (Adapter Out) porque permite ejecución local sin dependencias externas y mantiene simplicidad para el challenge.
Es reemplazable por base de datos real sin modificar dominio ni casos de uso.

Se incluye en la raiz del proyecto un archivo `companies.json` con datos precargados para probar los endpoints GET.
Los endpoints POST guardan datos en este mismo archivo.


## Decisiones de Diseño
En esta implementación, los identificadores de las entidades del dominio se modelan como un  tipo primitivo **string** para mantener el modelo simple.
En un escenario productivo podrían modelarse como **UUID** o incluso como **Value Objects** para darle mas claridad al modelo, evitar errores de tipado entre distintos ids o para validaciones específicas

## Tests
El proyecto incluye tests unitarios enfocados en entidades y casos de uso principales

## Endpoints HTTP

`Crear una empresa.`

**POST**  /companies

Body
```json
{
  "companyId": "string",
  "companyType": "PYME | CORPORATE"
}
```

`Registrar la fecha de adhesión de una empresa existente.`

**POST**  /companies/:id/adhesion

Path param: id (identificador de empresa)

`Obtener las empresas adheridas en los últimos 30 días.`

**GET**   /companies/adhesions/last-30-days

`Registrar transferencia de una empresa.`

**POST**  /companies/:id/transfers

Path param: id (identificador de empresa)

Body:
```json
{
  "amount": 1000,
  "destinationAccount": "string"
}
```

`Devuelve empresas con al menos una transferencia en los últimos 30 días.`

**GET**   /companies/transfers/last-30-days



## Parte adicional (AWS - Teórica)
El código lambda se encuentra en 
`src/lambda/RegisterCompanyAdhesionLambda.ts`

Input esperado
```json
{
  "id": "A123"
}
```

Output esperado

**Caso exitoso (201)**
```json
{
  "message": "Company adhesion registered"
}
```

**Error de validación (400)**
```json
{
  "message": "Company id is required"
}
```

### Integración con el sistema
La AWS Lambda funciona como un adaptador de entrada adicional.
La API HTTP implementada en NestJS y la Lambda exponen distintos puntos de entrada, pero ejecutan la misma lógica de negocio, invocando los mismos casos de uso de application.

La diferencia entre ambos se da en el mecanismo de entrada (HTTP Controller / API Gateway) y en el adaptador de persistencia utilizado



## Instalación y ejecución
Requisitos
Node.js ≥ 18
npm

### Instalación
```bash
npm install
npm start
```

## Run tests
```bash
# unit tests
$ npm run test

# cobertura
npm run test:cov
```