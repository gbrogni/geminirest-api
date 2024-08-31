import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { MeasurementRepository } from '@/domain/repositories/measurement-repository';
import { PrismaMeasurementRepository } from './prisma/repositories/prisma-measurement-repository';
import { CustomerRepository } from '@/domain/repositories/customer-repository';
import { PrismaCustomerRepository } from './prisma/repositories/prisma-customer-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: MeasurementRepository,
      useClass: PrismaMeasurementRepository,
    },
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    }
  ],
  exports: [
    PrismaService,
    MeasurementRepository,
    CustomerRepository
  ],
})
export class DatabaseModule { }