import saveFactoryState from "@/backend/factory/saveFactory";
import getAllFactories from "@/backend/factory/getAllFactories";
import removeFactory from "@/backend/factory/removeFactory";
import removeFactories from "@/backend/factory/removeFactories";
import { getFactoryByCnpj } from "@/core/data/factory";
import { getFactoryById } from "@/core/data/factory";

export default class Backend {
  static readonly factories = {
    save: saveFactoryState,
    getAll: getAllFactories,
    getByCnpj: getFactoryByCnpj,
    getById: getFactoryById,
    remove: removeFactory,
    removeMany: removeFactories,
  };
}
