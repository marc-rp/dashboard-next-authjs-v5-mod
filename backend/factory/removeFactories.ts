"use server";

import RepositoryFactory from "@/backend/factory/RepositoryFactory";

export default async function removeFactories(ids: string[]) {
  return RepositoryFactory.removeMany(ids);
}
