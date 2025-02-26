import Backend from "@/backend/customer";
import { Customer } from "@/core/model/Customer";
import { useEffect, useState } from "react";

export default function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Partial<Customer> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Backend.customers.getAll().then(setCustomers);
  }, []);

  async function save(customerData: Partial<Customer>) {
    setError(null);

    if (!customerData) {
      setError("Cliente inválido.");
      return;
    }

    // Compara os objetos convertendo-os para JSON
    // if (product && JSON.stringify(productData) === JSON.stringify(product)) {
    if (JSON.stringify(customerData) === JSON.stringify(customer)) {
      setError("Nenhuma alteração detectada. Envio cancelado.");
      return;
    }

    try {
      await Backend.customers.save(customerData);
      const updatedCustomers = await Backend.customers.getAll();
      setCustomers(updatedCustomers);
      setCustomer(null);
      setError(null);
    } catch (error) {
      console.error("Erro ao salvar cliente.", error);
      setError("Erro ao salvar cliente.");
    }
  }

  async function remove(id: string) {
    try {
      await Backend.customers.remove(id);
      const updatedCustomers = await Backend.customers.getAll();
      setCustomers(updatedCustomers);
      setCustomer(null);
      setError(null);
    } catch (error) {
      setError("Erro ao excluir o cliente.");
    }
  }

  // Função para remover vários produtos de uma vez
  async function groupRemove(ids: string[]) {
    await Backend.customers.removeMany(ids);
    const updatedCustomers = await Backend.customers.getAll();
    setCustomers(updatedCustomers);
    // Se o produto atualmente selecionado estiver entre os removidos, limpe-o
    if (customer && ids.includes(customer.id as string)) {
      setCustomer(null);
    }
  }

  return {
    customers,
    customer,
    error,
    setError,
    save,
    remove,
    groupRemove,
    cancel: () => setCustomer(null),
    updatedCustomer: (customer: Partial<Customer> | null) =>
      setCustomer(customer),
  };
}
