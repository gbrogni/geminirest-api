import { Customer } from '../entities/customer';

export abstract class CustomerRepository {
  abstract findById(id: string): Promise<Customer | null>;
}