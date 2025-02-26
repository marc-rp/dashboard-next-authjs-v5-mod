import { CustomerSchema } from "@/schemas";
import { prismadb } from "@/lib/prismadb";
import { Customer } from "@/core/model/Customer";
import { getCustomerByCnpj, getCustomerById } from "@/core/data/costumer";

export default class RepositoryCustomer {
  static async SaveCustomer(customer: Customer) {
    const validatedFields = CustomerSchema.safeParse(customer);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { id, cnpj, name, address, city, state } = validatedFields.data;

    const existingCustomer = await getCustomerById(id);

    if (existingCustomer) {
      await prismadb.customer.update({
        where: { id }, // Usa o 'id' para garantir a atualização correta
        data: {
          cnpj,
          name,
          address,
          city,
          state,
        },
      });

      return { success: "Customer updated successfully!" };
    } else {
      await prismadb.customer.create({
        data: {
          cnpj,
          name,
          address,
          city,
          state,
        },
      });

      return { success: "Confirmation customer sent!" };
    }
  }

  static async getAllCustomers(): Promise<Customer[]> {
    const data = await prismadb.customer.findMany();
    const customers = JSON.parse(JSON.stringify(data));

    return customers;
  }

  static async getCustomerById(id: string): Promise<Customer> {
    const customer = await prismadb.customer.findUnique({ where: { id } });
    return customer as Customer;
  }

  static async remove(id: string): Promise<void> {
    await prismadb.customer.delete({
      where: { id },
    });
  }

  static async removeMany(ids: string[]): Promise<void> {
    // await prismadb.cartItems.deleteMany({ where: { productId: { in: ids } } });
    await prismadb.customer.deleteMany({ where: { id: { in: ids } } });
  }
}
