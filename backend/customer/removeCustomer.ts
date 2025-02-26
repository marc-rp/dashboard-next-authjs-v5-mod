"use server";

import RepositoryCustomer from "@/backend/customer/RepositoryCustomer";

export default async function removeCustomer(id: string) {
  return RepositoryCustomer.remove(id);
}
