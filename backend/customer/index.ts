import getAllCustomers from "@/backend/customer/getAllCustomers";
import SaveCustomerState from "@/backend/customer/saveCustomer";
import { getCustomerByCnpj } from "@/core/data/costumer";
import { getCustomerById } from "@/core/data/costumer";
import removeCustomer from "@/backend/customer/removeCustomer";
import removeCustomers from "@/backend/customer/removeCustomers";

export default class Backend {
  static readonly customers = {
    save: SaveCustomerState,
    getAll: getAllCustomers,
    getByCnpj: getCustomerByCnpj,
    getById: getCustomerById,
    remove: removeCustomer,
    removeMany: removeCustomers,
  };
}
