import { CompanyTransfer } from '../CompanyTransfer';

describe('CompanyTransfer', () => {
  it('should detect transfer within last 30 days', () => {
    const now = new Date();
    const transfer = CompanyTransfer.createWithDate(
      new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      1000,
      'AR123',
    );

    expect(transfer.wasMadeInLast30Days(now)).toBe(true);
  });

  it('should detect transfer older than 30 days', () => {
    const now = new Date();
    const transfer = CompanyTransfer.createWithDate(
      new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      1000,
      'AR123',
    );

    expect(transfer.wasMadeInLast30Days(now)).toBe(false);
  });
});
