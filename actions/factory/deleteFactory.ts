"use server";
import { prismadb } from "@/lib/prismadb";

export const deleteFactory = async (params: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params.params).id;

  await prismadb.factory.delete({
    where: { id: id },
  });

  return { success: "Factory Deleted!" };
};
