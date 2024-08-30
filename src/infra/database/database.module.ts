import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { MeasurementRepository } from '@/domain/repositories/measurement-repository';
import { PrismaMeasurementRepository } from './prisma/repositories/prisma-measurement-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: MeasurementRepository,
      useClass: PrismaMeasurementRepository,
    }
  ],
  exports: [
    PrismaService,
    MeasurementRepository,
  ],
})
export class DatabaseModule { }