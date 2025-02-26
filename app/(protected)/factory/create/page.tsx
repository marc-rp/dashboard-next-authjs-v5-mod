"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FactorySchema } from "@/schemas";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { getProductByCode, getProducts } from "@/data/product/product";
import Link from "next/link";
import {
  CircleMinusIcon,
  Factory,
  Plus,
  PlusCircle,
  PlusCircleIcon,
  PlusSquareIcon,
} from "lucide-react";
import { createFactory } from "@/actions/factory/createFactory";
import { getFactoryByCnpj } from "@/data/factory/factory";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  const router = useRouter();
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  // const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FactorySchema>>({
    resolver: zodResolver(FactorySchema),
    defaultValues: {
      cnpj: "",
      name: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FactorySchema>) => {
    const validatedFields = FactorySchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { cnpj, name, address, city, state } = validatedFields.data;

    const existingFactory = await getFactoryByCnpj(cnpj);

    if (existingFactory) {
      return { error: "Product already exists!" };
    }

    startTransition(() => {
      createFactory(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            form.reset();
            setSuccess(data.success);
            router.refresh();
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="flex justify-center items-start p-14">
      <div className="flex justify-center items-center p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/factory"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                <CircleMinusIcon className="h-20 w-20" />
                <span className="sr-only">fábricas</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">fábricas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Card className="w-[600px] sm:ml-14 p-4">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            ⚙️ Create Factory
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              type="text"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              type="text"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              type="text"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              type="text"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              type="text"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
