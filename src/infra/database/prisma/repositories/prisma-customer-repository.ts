import { CustomerRepository } from '@/domain/repositories/customer-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper';
import { Customer } from '@/domain/entities/customer';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {

  constructor(private prisma: PrismaService) { }

  public async findById(customer_id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customer_id
      }
    });

    return customer ? PrismaCustomerMapper.toDomain(customer) : null;
  }

}