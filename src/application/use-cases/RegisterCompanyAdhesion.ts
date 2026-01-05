import { Injectable, Inject } from '@nestjs/common';
import type { CompanyRepository } from '../ports/out/CompanyRepository';
import { COMPANY_REPOSITORY } from '../ports/out/company-repository.token';
import { CompanyAdhesion } from '../../domain/company/CompanyAdhesion';

@Injectable()
export class RegisterCompanyAdhesion {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(companyId: string): Promise<void> {
    const companies = await this.companyRepository.findAll();
    const company = companies.find((c) => c.getId() === companyId);

    if (!company) {
      throw new Error(`Company with id ${companyId} does not exist`);
    }

    company.registerAdhesion(CompanyAdhesion.createNow());
    await this.companyRepository.save(company);
  }
}
