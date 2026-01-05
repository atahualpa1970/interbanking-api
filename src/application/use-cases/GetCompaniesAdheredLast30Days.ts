import { Company } from '../../domain/company/Company';
import { CompanyRepository } from '../ports/out/CompanyRepository';

export class GetCompaniesAdheredLast30Days {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(referenceDate?: Date): Promise<Company[]> {
    const companies = await this.companyRepository.findAll();

    return companies.filter((company) =>
      company.wasAdheredInLast30Days(referenceDate),
    );
  }
}
