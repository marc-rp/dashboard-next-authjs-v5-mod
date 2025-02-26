import Product from "@/core/model/Product";

export interface LineProductProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export default function LineProduct(props: LineProductProps) {
  return (
    <div
      onClick={() => props.onClick?.(props.product)}
      className="flex bg-zinc-900 p-4 rounded-md cursor-pointer"
    >
      <div className="flex flex-col">
        <span>Code: {props.product.code}</span>
        <span>Name: {props.product.name}</span>
        <span>
          Price:{" "}
          {Number(props.product.price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        <span>{`${Number(props.product.price) * 5}`}</span>
      </div>
    </div>
  );
}
