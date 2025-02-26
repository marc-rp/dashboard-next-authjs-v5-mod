"use server";

import RepositoryFactory from "@/backend/factory/RepositoryFactory";

export default async function removeFactory(id: string) {
  return RepositoryFactory.remove(id);
}
