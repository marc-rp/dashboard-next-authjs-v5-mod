"use server";

import Id from "@/core/utils/id";
import RepositoryCustomer from "@/backend/customer/RepositoryCustomer";
import { Customer } from "@/core/model/Customer";

export default async function SaveCustomerState(customer: Partial<Customer>) {
  const newCustomer = {
    ...customer,
    id: customer?.id ?? Id.new,
    cnpj: customer?.cnpj,
    name: customer?.name,
    address: customer?.address,
    city: customer?.city,
    state: customer?.state,
  };

  return RepositoryCustomer.SaveCustomer(newCustomer as Customer);
}
