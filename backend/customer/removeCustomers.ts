"use server";

import RepositoryCustomer from "@/backend/customer/RepositoryCustomer";

export default async function removeCustomers(ids: string[]) {
  return RepositoryCustomer.removeMany(ids);
}
