import saveProductState from "@/backend/product/saveProduct";
import getAllProducts from "@/backend/product/getAllProducts";
import { getProductByCode } from "@/core/data/product";
import { getProductById } from "@/core/data/product";
import removeProduct from "@/backend/product/removeProduct";
import removeProducts from "@/backend/product/removeProducts";

export default class Backend {
  static readonly products = {
    save: saveProductState,
    getAll: getAllProducts,
    getByCode: getProductByCode,
    getById: getProductById,
    remove: removeProduct,
    removeMany: removeProducts,
  };
}
