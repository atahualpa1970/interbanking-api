import { Inject } from '@nestjs/common';
import { COMPANY_REPOSITORY } from '../ports/out/company-repository.token';
import type { CompanyRepository } from '../ports/out/CompanyRepository';
import { Company } from '../../domain/company/Company';

export class GetCompaniesWithTransfersLast30Days {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(referenceDate: Date = new Date()): Promise<Company[]> {
    const companies = await this.companyRepository.findAll();

    return companies.filter((company) =>
      company.getTransfers().some((t) => t.wasMadeInLast30Days(referenceDate)),
    );
  }
}
