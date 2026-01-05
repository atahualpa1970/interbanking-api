export class CompanyTransfer {
  private readonly date: Date;
  private readonly amount: number;
  private readonly destinationAccount: string;

  private constructor(date: Date, amount: number, destinationAccount: string) {
    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }

    if (!destinationAccount) {
      throw new Error('Destination account is required');
    }

    this.date = date;
    this.amount = amount;
    this.destinationAccount = destinationAccount;
  }

  static createNow(
    amount: number,
    destinationAccount: string,
  ): CompanyTransfer {
    return new CompanyTransfer(new Date(), amount, destinationAccount);
  }

  static createWithDate(
    date: Date,
    amount: number,
    destinationAccount: string,
  ): CompanyTransfer {
    return new CompanyTransfer(date, amount, destinationAccount);
  }

  public wasMadeInLast30Days(referenceDate: Date = new Date()): boolean {
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - 30);

    return this.date >= startDate && this.date <= referenceDate;
  }

  public getDate(): Date {
    return this.date;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getDestinationAccount(): string {
    return this.destinationAccount;
  }
}
