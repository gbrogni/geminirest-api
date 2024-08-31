import { Customer } from '@/domain/entities/customer';
import { Customer as PrismaCustomer } from '@prisma/client';

export class PrismaCustomerMapper {

  static toDomain(customer: PrismaCustomer): Customer {
    return new Customer(
      customer.id
    );
  }

}