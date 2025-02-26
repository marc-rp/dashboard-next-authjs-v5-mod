"use server";

import * as z from "zod";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import { currentUser } from "@/lib/auth";

import { prismadb } from "@/lib/prismadb";
import { ProductSchema } from "@/schemas";
import { getProductByCode } from "@/data/product/product";
import Product from "@/core/model/Product";
import { Decimal } from "@prisma/client/runtime/library";

export default async function createProduct(product: Product) {
  const validatedFields = ProductSchema.safeParse(product);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { code, name, description, image, price } = validatedFields.data;

  const existingProduct = await getProductByCode(code);

  if (existingProduct) {
    return { error: "Product already exists!" };
  }

  // const productId = values.id || cuid();

  await prismadb.product.upsert({
    where: { id: product.id },
    update: product,
    create: product,
  });

  return { success: "Confirmation product sent!" };
}
