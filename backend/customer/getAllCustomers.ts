"use server";

import RepositoryCustomer from "@/backend/customer/RepositoryCustomer";

export default async function getAllCustomers() {
  return RepositoryCustomer.getAllCustomers();
}
