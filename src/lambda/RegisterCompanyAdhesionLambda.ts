import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RegisterCompanyAdhesion } from '../application/use-cases/RegisterCompanyAdhesion';
import { CompanyRepository } from '../application/ports/out/CompanyRepository';
import { JsonCompanyRepository } from '../adapters/out/persistence/json/JsonCompanyRepository';

const companyRepository: CompanyRepository = new JsonCompanyRepository();
const registerCompanyAdhesion = new RegisterCompanyAdhesion(companyRepository);

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;

  // Input validation (contrato)
  if (typeof id !== 'string' || id.trim() === '') {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Company id is required' }),
    };
  }

  await registerCompanyAdhesion.execute(id);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'Company adhesion registered' }),
  };
};
