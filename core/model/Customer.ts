// export interface Costumer {
//   id: string;
//   cnpj: string;
//   name: string;
//   address: string;
//   city: string;
//   state: string;
// }

import { User } from "@prisma/client";
import { Cart } from "./Cart";

export interface Customer {
  id: string; // ID único do cliente
  cnpj: string; // CNPJ do cliente
  name: string; // Nome do cliente
  address: string; // Endereço do cliente
  city: string; // Cidade do cliente
  state: string; // Estado do cliente
  // representativeId: string; // ID do representante (User) do cliente
  // representative: User; // Representante (User) do cliente
  cart: Cart[]; // Lista de pedidos feitos pelo cliente
}
