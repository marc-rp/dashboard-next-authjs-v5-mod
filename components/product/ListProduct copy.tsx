import { FormSuccess } from "@/components/form-success";
import LineFactory from "@/components/customer/LineCustomer";
import LineCustomer from "@/components/customer/LineCustomer";
import { Customer } from "@/core/model/Customer";
import LineProduct from "./LineProduct";
import Product from "@/core/model/Product";

export interface ListProductProps {
  products: Product[];
  onClick?: (product: Product) => void;
  // error?: string;
  success?: string;
}

export default function ListProduct(props: ListProductProps) {
  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen sm:ml-14 flex text-white flex-col gap-4">
        {/* <FormError message={props.error} /> */}
        <FormSuccess message={props.success} />
        {[...props.products]?.reverse().map((product: Product) => {
          return (
            <LineProduct
              key={product.id}
              product={product}
              onClick={props.onClick}
            />
          );
        })}
      </div>
    </div>
  );
}
