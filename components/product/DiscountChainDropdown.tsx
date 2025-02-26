"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface DiscountChainDropdownProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function DiscountChainDropdown({
  value,
  onChange,
}: DiscountChainDropdownProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    // Exemplo: buscar as cadeias de desconto já cadastradas
    async function fetchDiscountChains() {
      const response = await fetch("/api/discountChains");
      if (response.ok) {
        const data = await response.json();
        // Supondo que o retorno seja um array de strings
        setOptions(data);
      }
    }
    fetchDiscountChains();
  }, []);

  const handleSelect = (selected: string) => {
    if (selected === "custom") {
      setIsCustom(true);
    } else {
      onChange(selected);
      setIsCustom(false);
    }
  };

  const handleCustomSubmit = async () => {
    // Aqui você pode adicionar validação (ex: regex para "30%-15%-5%")
    const response = await fetch("/api/discountChains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pattern: customValue }),
    });
    if (response.ok) {
      // Adiciona o novo desconto às opções e seleciona-o
      setOptions((prev) => [...prev, customValue]);
      onChange(customValue);
      setIsCustom(false);
      setCustomValue("");
    }
  };

  return (
    <div>
      <Select onValueChange={handleSelect} defaultValue={value || ""}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um desconto sucessivo" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <SelectItem key="custom" value="custom">
            Criar Novo...
          </SelectItem>
        </SelectContent>
      </Select>
      {isCustom && (
        <div className="mt-2 flex items-center gap-2">
          <Input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Ex: 30%-15%-5%"
          />
          <button
            onClick={handleCustomSubmit}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}
