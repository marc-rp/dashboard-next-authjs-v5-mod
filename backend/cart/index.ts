import getAllCarts from "./getAllCarts";
import SaveCartState from "./saveCart";
import { getCartById } from "@/core/data/cart";
import removeCart from "./removeCart";

export default class Backend {
  static readonly carts = {
    save: SaveCartState,
    getAll: getAllCarts,
    getById: getCartById,
    remove: removeCart,
  };
}
