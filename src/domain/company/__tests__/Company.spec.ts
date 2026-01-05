import { Company } from '../Company';
import { CompanyAdhesion } from '../CompanyAdhesion';
import { CompanyType } from '../CompanyType';
import { CompanyTransfer } from '../../transfer/CompanyTransfer';

describe('Company', () => {
  it('should detect company adhered in last 30 days', () => {
    const company = Company.create('A1', CompanyType.PYME);

    const adhesion = CompanyAdhesion.createWithDate(
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    );

    company.registerAdhesion(adhesion);

    expect(company.wasAdheredInLast30Days()).toBe(true);
  });

  it('should register and keep transfers', () => {
    const company = Company.create('A1', CompanyType.PYME);

    const transfer = CompanyTransfer.createNow(1000, 'AR123');
    company.registerTransfer(transfer);

    expect(company.getTransfers().length).toBe(1);
  });

  it('should rehydrate transfers without altering them', () => {
    const company = Company.create('A1', CompanyType.PYME);

    const transfer = CompanyTransfer.createWithDate(
      new Date('2025-12-01'),
      500,
      'AR999',
    );

    company.registerTransfer(transfer);

    expect(company.getTransfers()[0]).toBe(transfer);
  });
});
