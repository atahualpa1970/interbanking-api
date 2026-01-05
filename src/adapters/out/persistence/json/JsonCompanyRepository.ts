import { promises as fs } from 'fs';
import { Company } from '../../../../domain/company/Company';
import { CompanyAdhesion } from '../../../../domain/company/CompanyAdhesion';
import { CompanyTransfer } from '../../../../domain/transfer/CompanyTransfer';
import { CompanyRepository } from '../../../../application/ports/out/CompanyRepository';
import { CompanyType } from 'src/domain/company/CompanyType';

interface RawTransfer {
  date: string;
  amount: number;
  destinationAccount: string;
}

interface RawCompany {
  id: string;
  type: CompanyType;
  adhesion?: { date: string };
  transfers?: RawTransfer[];
}

export class JsonCompanyRepository implements CompanyRepository {
  private readonly filePath = 'companies.json';

  private async readFile(): Promise<RawCompany[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as RawCompany[];
    } catch {
      return [];
    }
  }

  private async writeFile(data: RawCompany[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async save(company: Company): Promise<void> {
    const rawCompanies = await this.readFile();
    const existingIndex = rawCompanies.findIndex(
      (c) => c.id === company.getId(),
    );

    const companyData: RawCompany = {
      id: company.getId(),
      type: company.getType(),
      adhesion: company.getAdhesion()
        ? { date: company.getAdhesion()!.getDate().toISOString() }
        : undefined,
      transfers: company.getTransfers().map((t) => ({
        date: t.getDate().toISOString(),
        amount: t.getAmount(),
        destinationAccount: t.getDestinationAccount(),
      })),
    };

    if (existingIndex >= 0) {
      rawCompanies[existingIndex] = companyData; // upsert
    } else {
      rawCompanies.push(companyData);
    }

    await this.writeFile(rawCompanies);
  }

  async findAll(): Promise<Company[]> {
    const rawCompanies = await this.readFile();

    return rawCompanies.map((c) => {
      const adhesion = c.adhesion
        ? CompanyAdhesion.createWithDate(new Date(c.adhesion.date))
        : undefined;

      const company = adhesion
        ? Company.createWithAdhesion(c.id, c.type, adhesion)
        : Company.create(c.id, c.type);

      for (const t of c.transfers ?? []) {
        const transfer = CompanyTransfer.createWithDate(
          new Date(t.date),
          t.amount,
          t.destinationAccount,
        );

        company.rehydrateTransfer(transfer);
      }

      return company;
    });
  }
}
