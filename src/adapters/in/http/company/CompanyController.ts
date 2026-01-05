import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterCompany } from '../../../../application/use-cases/RegisterCompany';
import { RegisterCompanyAdhesion } from '../../../../application/use-cases/RegisterCompanyAdhesion';
import { CompanyType } from '../../../../domain/company/CompanyType';
import { GetCompaniesAdheredLast30Days } from 'src/application/use-cases/GetCompaniesAdheredLast30Days';
import { RegisterCompanyTransfer } from 'src/application/use-cases/RegisterCompanyTransfer';
import { GetCompaniesWithTransfersLast30Days } from 'src/application/use-cases/GetCompaniesWithTransfersLast30Days';
import { CompanyTransfer } from 'src/domain/transfer/CompanyTransfer';

class RegisterCompanyDto {
  companyId: string;
  companyType: CompanyType;
}

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly registerCompanyUseCase: RegisterCompany,
    private readonly registerCompanyAdhesion: RegisterCompanyAdhesion,
    private readonly getCompaniesAdheredLast30DaysUseCase: GetCompaniesAdheredLast30Days,
    private readonly registerCompanyTransfer: RegisterCompanyTransfer,
    private readonly getCompaniesWithTransfersLast30DaysUseCase: GetCompaniesWithTransfersLast30Days,
  ) {}

  @Post()
  async registerCompany(@Body() dto: RegisterCompanyDto): Promise<void> {
    await this.registerCompanyUseCase.execute(dto.companyId, dto.companyType);
  }

  @Post(':id/adhesion')
  async registerAdhesion(@Param('id') companyId: string): Promise<void> {
    await this.registerCompanyAdhesion.execute(companyId);
  }

  @Get('adhesions/last-30-days')
  async getCompaniesAdheredLast30Days() {
    return this.getCompaniesAdheredLast30DaysUseCase.execute();
  }

  @Post(':id/transfers')
  async registerTransfer(
    @Param('id') companyId: string,
    @Body('amount') amount: number,
    @Body('destinationAccount') destinationAccount: string,
  ): Promise<void> {
    const transfer = CompanyTransfer.createNow(amount, destinationAccount);
    await this.registerCompanyTransfer.execute(companyId, transfer);
  }

  @Get('transfers/last-30-days')
  async getCompaniesWithTransfersLast30Days() {
    return this.getCompaniesWithTransfersLast30DaysUseCase.execute();
  }
}
