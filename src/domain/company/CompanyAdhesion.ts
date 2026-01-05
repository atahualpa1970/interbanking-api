export class CompanyAdhesion {
  private readonly date: Date;

  private constructor(date: Date) {
    this.date = date;
  }

  static createNow(): CompanyAdhesion {
    return new CompanyAdhesion(new Date());
  }

  static createWithDate(date: Date): CompanyAdhesion {
    if (!date) {
      throw new Error('Adhesion date is required');
    }

    return new CompanyAdhesion(date);
  }

  public getDate(): Date {
    return this.date;
  }

  public wasAdheredInLast30Days(referenceDate: Date = new Date()): boolean {
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - 30);

    return this.date >= startDate && this.date <= referenceDate;
  }
}
