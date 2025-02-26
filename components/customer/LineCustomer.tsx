import { Customer } from "@/core/model/Customer";

export interface LineCustomerProps {
  customer: Customer;
  onClick?: (customer: Customer) => void;
}

export default function LineCustomer(props: LineCustomerProps) {
  return (
    <div
      onClick={() => props.onClick?.(props.customer)}
      className="flex bg-zinc-900 p-4 rounded-md cursor-pointer"
    >
      <div className="flex flex-col">
        <span>CNPJ: {props.customer.cnpj}</span>
        <span>Name: {props.customer.name}</span>
        <span>Address: {props.customer.address}</span>
        <span>City: {props.customer.city}</span>
        <span>State: {props.customer.state}</span>
      </div>
    </div>
  );
}
