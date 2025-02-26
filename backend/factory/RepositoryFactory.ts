import { prismadb } from "@/lib/prismadb";
import { FactorySchema } from "@/schemas";
import { Factory } from "@/core/model/Factory";
import { getFactoryById } from "@/core/data/factory";

export default class RepositoryFactory {
  static async SaveFactory(factory: Factory) {
    const validatedFields = FactorySchema.safeParse(factory);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { id, cnpj, name, address, city, state } = validatedFields.data;

    const existingFactory = await getFactoryById(id);

    // const existingFactory = await prismadb.factory.findUnique({
    //   where: { id },
    // });

    if (existingFactory) {
      await prismadb.factory.update({
        where: { id },
        data: {
          cnpj,
          name,
          address,
          city,
          state,
        },
      });

      return { success: "Factory updated successfully!" };
    } else {
      // Cria uma nova fábrica se não existir
      await prismadb.factory.create({
        data: {
          cnpj,
          name,
          address,
          city,
          state,
        },
      });

      return { success: "Factory created successfully!" };
    }
  }

  static async getAllFactories(): Promise<Factory[]> {
    return await prismadb.factory.findMany();
  }

  static async getFactoryById(id: string): Promise<Factory | null> {
    return await prismadb.factory.findUnique({ where: { id } });
  }

  static async remove(id: string): Promise<void> {
    await prismadb.factory.delete({ where: { id } });
  }

  static async removeMany(ids: string[]): Promise<void> {
    // await prismadb.cartItems.deleteMany({ where: { productId: { in: ids } } });
    await prismadb.factory.deleteMany({ where: { id: { in: ids } } });
  }
}
