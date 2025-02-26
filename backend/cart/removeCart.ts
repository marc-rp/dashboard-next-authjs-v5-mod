"use server";

import RepositoryOrder from "@/backend/cart/RepositoryCart";

export default async function removeOrder(id: string) {
  return RepositoryOrder.remove(id);
}
