"use client";

import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export default function TextInput({ label, error, ...props }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input {...props} className="bg-zinc-500 p-2 rounded-md outline-none" />
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
}
