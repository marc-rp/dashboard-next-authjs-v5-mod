import { Decimal } from "@prisma/client/runtime/library";

export default interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image?: string;
  price: string;
}
