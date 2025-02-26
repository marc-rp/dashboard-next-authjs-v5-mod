import { Factory } from "@/core/model/Factory";

export interface LineFactoryProps {
  factory: Factory;
  onClick?: (factory: Factory) => void;
}

export default function LineFactory(props: LineFactoryProps) {
  return (
    <div
      onClick={() => props.onClick?.(props.factory)}
      className="flex bg-zinc-900 p-4 rounded-md cursor-pointer"
    >
      <div className="flex flex-col">
        <span>CNPJ: {props.factory.cnpj}</span>
        <span>Name: {props.factory.name}</span>
        <span>Address: {props.factory.address}</span>
        <span>City: {props.factory.city}</span>
        <span>State: {props.factory.state}</span>
      </div>
    </div>
  );
}
