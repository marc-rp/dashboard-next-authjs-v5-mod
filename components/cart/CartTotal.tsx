import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Cart, CartItems } from "@/core/model/Cart";
import { saveCart } from "@/actions/cart/saveCart";
import { Customer } from "@/core/model/Customer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { CartSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import Id from "@/core/utils/id";
import SaveCartState from "@/backend/cart/saveCart";

// Adicione no topo do arquivo CartTotal.tsx:
export type CartResponse =
  | { success: string; error?: undefined }
  | { error: string; success?: undefined };

export interface CartTotalProps {
  cart: Cart | null;
  cartItems: CartItems[];
  customers: Customer[];
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  // success?: string;
  // error?: string;
  save: (customerData: Partial<Customer>) => Promise<void>;
}

export default function CartTotal(props: CartTotalProps) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // Função para calcular o preço com desconto
  const calculateDiscountedPrice = (
    price: number,
    quantity: number,
    discount: string | undefined,
  ): number => {
    const total = price * quantity;
    if (!discount) return total;

    const discounts = discount
      .split("-")
      .map((d) => parseFloat(d.replace("%", "")) / 100);
    let discountedPrice = total;

    discounts.forEach((discountRate) => {
      discountedPrice -= discountedPrice * discountRate;
    });

    return discountedPrice;
  };

  const total = props.cartItems?.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0,
  );

  // Calcular o total com desconto
  const totalWithDiscount = props.cartItems?.reduce(
    (acc, item) =>
      acc +
      calculateDiscountedPrice(
        Number(item.product.price),
        item.quantity,
        item.discount,
      ),
    0,
  );

  const form = useForm<z.infer<typeof CartSchema>>({
    resolver: zodResolver(CartSchema),
    defaultValues: {
      id: props.cart?.id || Id.new,
      customerId: props.cart?.customerId || "",
      // total: props.cart?.total || 0,
      total: total,
      cartItems: props.cartItems.map((item) => ({
        id: item.id || Id.new,
        cartId: props.cart?.id || Id.new,
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: Number(item.product.price),
        discount: item.discount,
      })),
    },
  });

  useEffect(() => {
    form.reset({
      id: props.cart?.id || Id.new,
      customerId: props.cart?.customerId || "",
      total: total,
      cartItems: props.cartItems.map((item) => ({
        id: item.id || Id.new,
        cartId: props.cart?.id || Id.new,
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: Number(item.product.price),
        discount: item.discount,
      })),
    });
  }, [props.cartItems, props.cart, total, form]);

  const onSubmit = async (values: z.infer<typeof CartSchema>) => {
    console.log("Total calculado:", total);
    console.log("Dados enviados:", JSON.stringify(values, null, 2));

    setSuccess("");
    setError("");

    startTransition(() => {
      SaveCartState(values as Cart).then((data) => {
        if (data?.success) {
          setSuccess(data.success);
          props.save({
            id: props.cart?.customerId || "",
            name:
              props.customers.find(
                (customer) => customer.id === props.cart?.customerId,
              )?.name || "",
          });
        } else {
          // props.onError(data.error ?? "");
          setError(data?.error);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4 border rounded-md p-7">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {props.customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-zinc-500">Total</span>
              <span className="text-3xl font-bold text-yellow-500">
                R$ {total?.toFixed(2)}
              </span>
              <span className="text-zinc-500">Com desconto</span>
              <span className="text-3xl font-bold text-green-500">
                R$ {totalWithDiscount?.toFixed(2)}
              </span>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-md"
            >
              {isPending ? "Processando..." : "Finalizar Pedido"}
            </Button>
          </div>

          <FormSuccess message={success} />
          <FormError message={error} />
        </div>
      </form>
    </Form>
  );
}
