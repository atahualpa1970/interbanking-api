import { Injectable, Inject } from '@nestjs/common';
import type { CompanyRepository } from '../ports/out/CompanyRepository';
import { COMPANY_REPOSITORY } from '../ports/out/company-repository.token';
import { Company } from '../../domain/company/Company';
import { CompanyType } from '../../domain/company/CompanyType';

@Injectable()
export class RegisterCompany {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(id: string, type: CompanyType): Promise<void> {
    const company = Company.create(id, type);
    await this.companyRepository.save(company);
  }
}
