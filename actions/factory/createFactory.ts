"use server";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { currentUser } from "@/lib/auth";

import { prismadb } from "@/lib/prismadb";
import { FactorySchema } from "@/schemas";
import { getFactoryByCnpj } from "@/data/factory/factory";

export const createFactory = async (
  values: z.infer<typeof FactorySchema>,
) => {
  const user = await currentUser();

  const validatedFields = FactorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { cnpj, name, address, city, state } =
    validatedFields.data;

  const existingProduct = await getFactoryByCnpj(cnpj);

  if (existingProduct) {
    return { error: "Factory already exists!" };
  }

  await prismadb.factory.create({
    data: {
      cnpj,
      name,
      address,
      city,
      state,
    },
  });

  return { success: "Confirmation factory sent!" };
};
