import { Module } from '@nestjs/common';
import { CompanyController } from './adapters/in/http/company/CompanyController';
import { RegisterCompanyAdhesion } from './application/use-cases/RegisterCompanyAdhesion';
import { GetCompaniesAdheredLast30Days } from './application/use-cases/GetCompaniesAdheredLast30Days';
import { JsonCompanyRepository } from './adapters/out/persistence/json/JsonCompanyRepository';
import { COMPANY_REPOSITORY } from './application/ports/out/company-repository.token';
import { CompanyRepository } from './application/ports/out/CompanyRepository';
import { RegisterCompanyTransfer } from './application/use-cases/RegisterCompanyTransfer';
import { GetCompaniesWithTransfersLast30Days } from './application/use-cases/GetCompaniesWithTransfersLast30Days';
import { RegisterCompany } from './application/use-cases/RegisterCompany';

@Module({
  controllers: [CompanyController],
  providers: [
    RegisterCompany,
    RegisterCompanyAdhesion,
    RegisterCompanyTransfer,
    {
      provide: COMPANY_REPOSITORY,
      useClass: JsonCompanyRepository,
    },
    {
      provide: GetCompaniesAdheredLast30Days,
      useFactory: (companyRepository: CompanyRepository) =>
        new GetCompaniesAdheredLast30Days(companyRepository),
      inject: [COMPANY_REPOSITORY],
    },
    {
      provide: GetCompaniesWithTransfersLast30Days,
      useFactory: (companyRepository: CompanyRepository) =>
        new GetCompaniesWithTransfersLast30Days(companyRepository),
      inject: [COMPANY_REPOSITORY],
    },
  ],
})
export class AppModule {}
