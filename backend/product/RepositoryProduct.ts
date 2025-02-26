import { getProductByCode, getProductById } from "@/core/data/product";
import { prismadb } from "@/lib/prismadb";
import { ProductSchema } from "@/schemas";
import Product from "@/core/model/Product";
import { Decimal } from "@prisma/client/runtime/library";

export default class RepositoryProduct {
  static async SaveProduct(product: Product) {
    const validatedFields = ProductSchema.safeParse(product);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { id, code, name, description, image, price } = validatedFields.data;

    const priceDecimal = new Decimal(price);

    const existingProduct = await getProductById(id);

    // const existingProduct = await prismadb.product.findUnique({
    //   where: { id },
    // });

    if (existingProduct) {
      await prismadb.product.update({
        where: { id },
        data: {
          code,
          name,
          description,
          image: image || "",
          price: priceDecimal,
        },
      });
      return { success: "Product updated successfully!" };
    } else {
      // Se não existir, cria um novo produto
      await prismadb.product.create({
        data: {
          code,
          name,
          description,
          image: image || "",
          price: priceDecimal,
        },
      });
      return { success: "Confirmation product sent!" };
    }
  }
  // Converter price para string ao retornar para o frontend
  private static convertProduct(product: any): Product {
    return { ...product, price: product.price.toString() };
  }

  static async getAllProducts(): Promise<Product[]> {
    const products = await prismadb.product.findMany();
    return products.map(this.convertProduct);
  }

  static async getProductById(id: string): Promise<Product | null> {
    const product = await prismadb.product.findUnique({ where: { id } });
    return product ? this.convertProduct(product) : null;
  }

  static async remove(id: string): Promise<void> {
    await prismadb.cartItems.deleteMany({ where: { productId: id } });
    await prismadb.product.delete({ where: { id } });
  }

  static async removeMany(ids: string[]): Promise<void> {
    await prismadb.cartItems.deleteMany({ where: { productId: { in: ids } } });
    await prismadb.product.deleteMany({ where: { id: { in: ids } } });
  }
}
