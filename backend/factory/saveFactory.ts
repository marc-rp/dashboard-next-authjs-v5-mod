"use server";

import Id from "@/core/utils/id";
import { Factory } from "@/core/model/Factory";
import RepositoryFactory from "./RepositoryFactory";

export default async function SaveFactoryState(factory: Partial<Factory>) {
  const newFactory = {
    // ...factory,
    id: factory?.id ?? Id.new,
    cnpj: factory?.cnpj,
    name: factory?.name,
    address: factory?.address,
    city: factory?.city,
    state: factory?.state,
    discounts: factory?.discounts ?? [], // Now correctly receives string[]
  };

  return RepositoryFactory.SaveFactory(newFactory as Factory);
}
