import * as z from "zod";
import { UserRole } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ProductSchema = z.object({
  id: z.string(),
  code: z.string().min(1, {
    message: "code is required",
  }),
  name: z.string().min(1, {
    message: "name is required",
  }),
  description: z.string().min(1, {
    message: "description is required",
  }),
  image: z.string().optional().or(z.literal("")),
  price: z.string().min(1, {
    message: "price is required",
  }),
});

export const FactorySchema = z.object({
  id: z.string(),
  cnpj: z.string().min(2, {
    message: "cnpj is required",
  }),
  name: z.string().min(1, {
    message: "name is required",
  }),
  address: z.string().min(1, {
    message: "address is required",
  }),
  city: z.string().min(1, {
    message: "city is required",
  }),
  state: z.string().min(1, {
    message: "state is required",
  }),
  discounts: z
    .array(
      z.object({
        id: z.string(),
        value: z
          .string()
          .regex(/^(\d+%(-\d+%)*)$/, "Formato inválido! Ex.: 30%-20%-10%"),
      }),
    )
    .optional(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  cnpj: z.string().min(2, {
    message: "cnpj is required",
  }),
  name: z.string().min(1, {
    message: "name is required",
  }),
  address: z.string().min(1, {
    message: "address is required",
  }),
  city: z.string().min(1, {
    message: "city is required",
  }),
  state: z.string().min(1, {
    message: "state is required",
  }),
});

// Decimal support (adapted for Prisma Decimal)
const DecimalSchema = z.string().refine((val) => !isNaN(Number(val)), {
  message: "Must be a valid decimal value",
});

export const CartSchema = z.object({
  id: z.string(),
  customerId: z.string().min(1, "Selecione um cliente"),
  // customer: CustomerSchema,
  total: z.number(),
  cartItems: z.array(
    z.object({
      id: z.string(),
      cartId: z.string(),
      productId: z.string(),
      product: ProductSchema,
      quantity: z.number().min(1),
      price: z.number().min(0.01),
      discount: z.string().optional(),
    }),
  ),
});
