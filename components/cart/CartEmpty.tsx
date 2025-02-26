import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 text-zinc-500">
      <ShoppingCart size={150} stroke="0.5" />
      <div>
        <h2 className="text-3xl ">Seu carrinho está vazio</h2>
        <p>Adicione produtos clicando no botão abaixo</p>
      </div>
      <Link href="/shop">
        <Button className="rounded-sm px-4 py-2">Ver produtos</Button>
      </Link>
    </div>
  );
}
