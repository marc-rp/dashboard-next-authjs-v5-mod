import { ChangeEvent, useState } from "react";
import { CartItems } from "@/core/model/Cart";
import Image from "next/image";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import useCartContext from "@/hooks/cart/useCartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Lista inicial de descontos predefinidos
const initialDiscounts = ["30%-15%-5%", "20%-10%", "15%"];

export interface CartItemBoxProps {
  item: CartItems;
  add: (item: CartItems) => void;
  sub: (item: CartItems) => void;
  update?: (item: CartItems, quantity: number, discount?: string) => void;
}

export default function CartItembox(props: CartItemBoxProps) {
  const { add, sub, update } = useCartContext();
  const [customDiscount, setCustomDiscount] = useState(""); // Estado para o desconto personalizado
  const [discounts, setDiscounts] = useState<string[]>(initialDiscounts); // Estado para a lista de descontos

  // Manipulador para mudança de quantidade
  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10) || 0;
    update?.(props.item.product, newQuantity, props.item.discount || "");
  };

  // Manipulador para mudança no dropdown de desconto
  const handleDiscountChange = (value: string) => {
    if (value === "personalizado") {
      // Aqui atualizamos o desconto para a string "personalizado"
      update?.(props.item.product, props.item.quantity, "personalizado");
      setCustomDiscount("");
    } else {
      update?.(props.item.product, props.item.quantity, value);
      setCustomDiscount("");
    }
  };

  // Manipulador para o input de desconto personalizado
  const handleCustomDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDiscount = e.target.value;
    setCustomDiscount(newDiscount);
    // if (props.item.discount === "personalizado") {
    //   update?.(props.item.product, props.item.quantity, newDiscount);
    // }
  };

  // Função para salvar o novo desconto na lista
  const saveNewDiscount = () => {
    if (customDiscount && !discounts.includes(customDiscount)) {
      setDiscounts([...discounts, customDiscount]);
      update?.(props.item.product, props.item.quantity, customDiscount);
    }
  };

  // Calcula o valor com desconto (usa o customDiscount enquanto o item estiver em modo "personalizado")
  const displayedDiscount =
    props.item.discount === "personalizado"
      ? customDiscount
      : props.item.discount || "";

  // Função para calcular o valor com desconto
  const calculateDiscountedPrice = (
    price: number,
    quantity: number,
    discount: string,
  ): number => {
    const total = price * quantity;
    if (!discount || discount === "personalizado") return total;

    const discountRates = discount
      .split("-")
      .map((d) => parseFloat(d.replace("%", "")) / 100);
    let discountedPrice = total;

    discountRates.forEach((rate) => {
      discountedPrice -= discountedPrice * rate;
    });

    return discountedPrice;
  };

  // Calcula o valor com desconto em tempo real
  // const discountedPrice = calculateDiscountedPrice(
  //   Number(props.item.product.price),
  //   props.item.quantity,
  //   props.item.discount === "personalizado"
  //     ? customDiscount
  //     : props.item.discount || "",
  // );

  const discountedPrice = calculateDiscountedPrice(
    Number(props.item.product.price),
    props.item.quantity,
    displayedDiscount,
  );

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5 rounded-md overflow-hidden border p-4">
      {/* Imagem do produto */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
        <Image
          src={props.item.product.image || ""}
          alt={props.item.product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Informações do produto */}
      <div className="flex flex-1 flex-col gap-2">
        <span className="text-lg sm:text-xl font-bold">
          {props.item.product.name}
        </span>
        <span className="text-sm text-zinc-400 line-clamp-2">
          {props.item.product.description}
        </span>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-zinc-400 text-base sm:text-lg font-bold">
          <span>R$ {Number(props.item.product.price).toFixed(2)}</span>
          <XIcon size={16} className="hidden md:block" />
          <span>{props.item.quantity}</span>
          <span className="hidden md:block">=</span>
          <span className="text-yellow-500">
            R${" "}
            {(Number(props.item.product.price) * props.item.quantity).toFixed(
              2,
            )}
          </span>
          {props.item.discount && (
            <span className="text-green-500">
              com desconto: R$ {discountedPrice.toFixed(2)}
            </span>
          )}
          {props.item.discount === "personalizado" && (
            <div className="flex gap-2">
              <Input
                className="w-24"
                placeholder="Ex: 10%-5%"
                value={customDiscount}
                onChange={handleCustomDiscountChange}
              />
              <Button onClick={saveNewDiscount}>Salvar</Button>
            </div>
          )}
        </div>
      </div>

      {/* Seleção de desconto */}
      <div className="flex gap-2 items-center">
        <Select
          onValueChange={handleDiscountChange}
          value={
            props.item.discount === "personalizado"
              ? "personalizado"
              : props.item.discount || ""
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Desconto" />
          </SelectTrigger>
          <SelectContent>
            {discounts.map((discount) => (
              <SelectItem key={discount} value={discount}>
                {discount}
              </SelectItem>
            ))}
            <SelectItem value="personalizado">Personalizado</SelectItem>
          </SelectContent>
        </Select>
        {props.item.discount === "personalizado" && (
          <div className="flex gap-2">
            <Input
              className="w-24"
              placeholder="Ex: 10%-5%"
              value={customDiscount}
              onChange={handleCustomDiscountChange}
            />
            {/* <Button onClick={saveNewDiscount}>Salvar</Button> */}
          </div>
        )}
      </div>

      {/* Controles de quantidade */}
      <div className="flex gap-2 items-center">
        <Button
          className="w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center"
          onClick={() => sub(props.item.product)}
        >
          <MinusIcon size={18} className="sm:size-20" />
        </Button>
        <Input
          className="w-12 h-10 sm:w-14 sm:h-11 text-center [&::-webkit-inner-spin-button]:appearance-none"
          value={props.item.quantity}
          onChange={handleQuantityChange}
          type="number"
          min={1}
        />
        <Button
          className="w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center"
          onClick={() => add(props.item.product)}
        >
          <PlusIcon size={18} className="sm:size-20" />
        </Button>
      </div>
    </div>
  );
}
