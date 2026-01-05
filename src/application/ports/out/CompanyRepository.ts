import { Company } from '../../../domain/company/Company';

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  findAll(): Promise<Company[]>;
}
