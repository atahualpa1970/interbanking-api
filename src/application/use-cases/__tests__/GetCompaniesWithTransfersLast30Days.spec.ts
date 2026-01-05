import { GetCompaniesWithTransfersLast30Days } from '../GetCompaniesWithTransfersLast30Days';
import { CompanyRepository } from '../../ports/out/CompanyRepository';
import { Company } from '../../../domain/company/Company';
import { CompanyAdhesion } from '../../../domain/company/CompanyAdhesion';
import { CompanyType } from '../../../domain/company/CompanyType';
import { CompanyTransfer } from '../../../domain/transfer/CompanyTransfer';

describe('GetCompaniesWithTransfersLast30Days', () => {
  it('should return only companies with recent transfers', async () => {
    const recentTransfer = CompanyTransfer.createWithDate(
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      1000,
      'AR1',
    );

    const oldTransfer = CompanyTransfer.createWithDate(
      new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      1000,
      'AR2',
    );

    const companyWithRecentTransfer = Company.create('C1', CompanyType.PYME);
    companyWithRecentTransfer.registerAdhesion(CompanyAdhesion.createNow());
    companyWithRecentTransfer.registerTransfer(recentTransfer);

    const companyWithOldTransfer = Company.create('C2', CompanyType.PYME);
    companyWithOldTransfer.registerAdhesion(CompanyAdhesion.createNow());
    companyWithOldTransfer.registerTransfer(oldTransfer);

    const repository: CompanyRepository = {
      save: jest.fn(),
      findAll: jest
        .fn()
        .mockResolvedValue([companyWithRecentTransfer, companyWithOldTransfer]),
    };

    const useCase = new GetCompaniesWithTransfersLast30Days(repository);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].getId()).toBe('C1');
  });
});
