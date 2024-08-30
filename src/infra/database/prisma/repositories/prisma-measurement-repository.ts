import { MeasurementRepository } from '@/domain/repositories/measurement-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MeasurementType } from '@/domain/entities/measurement-type';
import { Measurement } from '@/domain/entities/measure';
import { PrismaMeasurementMapper } from '../mappers/prisma-measurement-mapper';

@Injectable()
export class PrismaMeasurementRepository implements MeasurementRepository {

  constructor(private prisma: PrismaService) { }

  public async findById(measurement_uuid: string): Promise<Measurement | null> {
    const measurement = await this.prisma.measurement.findUnique({
      where: {
        id: measurement_uuid
      }
    });

    if (!measurement) {
      return null;
    }

    return PrismaMeasurementMapper.toDomain(measurement);
  }

  public async confirmValue(measurement_uuid: string, confirmed_value: number): Promise<void> {
    await this.prisma.measurement.update({
      where: {
        id: measurement_uuid
      },
      data: {
        measurement_value: confirmed_value,
        has_confirmed: true
      }
    });
  }

  public async existsMonthlyCheck(customer_code: string, measure_datetime: Date, measurement_type: MeasurementType): Promise<boolean> {
    const startOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
    const endOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 0);

    return await this.prisma.measurement.findFirst({
      where: {
        customer_code,
        measurement_type,
        measurement_datetime: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
    }).then(item => !!item);
  }
}