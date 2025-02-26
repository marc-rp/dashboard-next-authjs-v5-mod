"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

// import { update } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { ProductSchema, SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { getProductById, getProductByCode } from "@/data/product/product";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const updateProduct = async (
  values: z.infer<typeof ProductSchema>,
  params: { params: Promise<{ id: string }> },
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  const id = (await params.params).id;

  await prismadb.product.update({
    where: { id: id },
    data: {
      ...values,
    },
  });

  return { success: "Product Updated!" };
};
