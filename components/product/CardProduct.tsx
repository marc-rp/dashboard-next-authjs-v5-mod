import { useRouter } from "next/navigation";
import Product from "@/core/model/Product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import useCartContext from "@/hooks/cart/useCartContext";

export interface CardProductProps {
  product: Product;
}

export default function CardProduct(props: CardProductProps) {
  const { add } = useCartContext();
  const router = useRouter();
  const { id, image, name, description, price } = props.product;
  return (
    <Card
      onClick={() => router.push(`/product/${id}`)}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
            {name}
          </CardTitle>
          <ShoppingBag className="ml-auto w-4 h-4" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[350px]">
          <Image className="object-cover" fill src={image || ""} alt={name} />
        </div>
      </CardContent>
      <CardContent className="flex justify-between items-center">
        <span>
          Preço:{" "}
          {Number(price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            add(props.product);
          }}
        >
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
}
