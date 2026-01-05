import { Inject } from '@nestjs/common';
import { COMPANY_REPOSITORY } from '../ports/out/company-repository.token';
import type { CompanyRepository } from '../ports/out/CompanyRepository';
import { CompanyTransfer } from 'src/domain/transfer/CompanyTransfer';

export class RegisterCompanyTransfer {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(companyId: string, transfer: CompanyTransfer): Promise<void> {
    const companies = await this.companyRepository.findAll();
    const company = companies.find((c) => c.getId() === companyId);
    if (!company) throw new Error('Company not found');

    company.registerTransfer(transfer);
    await this.companyRepository.save(company);
  }
}
