import Backend from "@/backend/factory";
import { Factory } from "@/core/model/Factory";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function useFactories() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [factory, setFactory] = useState<Partial<Factory> | null>(null);

  useEffect(() => {
    Backend.factories.getAll().then(setFactories);
  }, []);

  async function save() {
    if (!factory) {
      console.error("Factory is null or undefined");
      return;
    }
    try {
      // await Backend.products.save(product);
      const updatedFactories = await Backend.factories.getAll();
      setFactories(updatedFactories);
      setFactory(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  async function remove() {
    if (!factory || !factory.id) return;
    await Backend.factories.remove(factory.id);
    const factories = await Backend.factories.getAll();
    setFactories(factories);
    setFactory(null);
  }

  // Função para remover vários produtos de uma vez
  async function groupRemove(ids: string[]) {
    await Backend.factories.removeMany(ids);
    const updatedFactories = await Backend.factories.getAll();
    setFactories(updatedFactories);
    // Se o produto atualmente selecionado estiver entre os removidos, limpe-o
    if (factory && ids.includes(factory.id as string)) {
      setFactory(null);
    }
  }

  return {
    factories,
    factory,
    save,
    remove,
    groupRemove,
    cancel: () => setFactory(null),
    updateFactory: (factory: Partial<Factory> | null) => setFactory(factory),
  };
}
