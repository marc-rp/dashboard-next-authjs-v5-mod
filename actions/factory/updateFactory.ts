"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

// import { update } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { FactorySchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { getProductById, getProductByCode } from "@/data/product/product";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const updateFactory = async (
  values: z.infer<typeof FactorySchema>,
  params: { params: Promise<{ id: string }> },
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  const id = (await params.params).id;

  if (!id) {
    return { error: "Invalid factory ID" };
  }

  await prismadb.factory.update({
    where: { id: id },
    data: {
      ...values,
    },
  });

  return { success: "Factory Updated!" };
};
