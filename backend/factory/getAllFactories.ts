"use server";

import RepositoryFactory from "@/backend/factory/RepositoryFactory";

export default async function getAllFactories() {
  return RepositoryFactory.getAllFactories();
}
