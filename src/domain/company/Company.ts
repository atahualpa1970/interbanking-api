import { CompanyType } from './CompanyType';
import { CompanyAdhesion } from './CompanyAdhesion';
import { CompanyTransfer } from '../transfer/CompanyTransfer';

export class Company {
  private readonly id: string;
  private readonly type: CompanyType;
  private adhesion?: CompanyAdhesion;
  private transfers: CompanyTransfer[] = [];

  private constructor(
    id: string,
    type: CompanyType,
    adhesion?: CompanyAdhesion,
  ) {
    this.id = id;
    this.type = type;
    this.adhesion = adhesion;
  }

  static create(id: string, type: CompanyType): Company {
    return new Company(id, type);
  }

  static createWithAdhesion(
    id: string,
    type: CompanyType,
    adhesion: CompanyAdhesion,
  ): Company {
    return new Company(id, type, adhesion);
  }

  public getId(): string {
    return this.id;
  }

  public getType(): CompanyType {
    return this.type;
  }

  public getAdhesion(): CompanyAdhesion | undefined {
    return this.adhesion;
  }

  public registerAdhesion(adhesion: CompanyAdhesion): void {
    this.adhesion = adhesion;
  }

  public registerTransfer(transfer: CompanyTransfer): void {
    this.transfers.push(transfer);
  }

  public getTransfers(): CompanyTransfer[] {
    return [...this.transfers];
  }

  public rehydrateTransfer(transfer: CompanyTransfer): void {
    this.transfers.push(transfer);
  }

  public wasAdheredInLast30Days(referenceDate: Date = new Date()): boolean {
    return this.adhesion?.wasAdheredInLast30Days(referenceDate) ?? false;
  }
}
