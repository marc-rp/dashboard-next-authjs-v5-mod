"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductUploaderProps {
  onUpload: (url: string) => void;
  isPending: boolean;
  isFormValid: boolean; // Nova prop para controlar se o upload está habilitado
  currentImage?: string | null;
  onRemove: () => void;
}

// Função para converter a imagem para WebP
async function convertImageToWebP(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível obter o contexto do canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File(
                [blob],
                file.name.replace(/\.\w+$/, ".webp"),
                { type: "image/webp" },
              );
              resolve(newFile);
            } else {
              reject(new Error("Falha na conversão para WebP"));
            }
          },
          "image/webp",
          0.001,
        );
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function ProductUploader({
  onUpload,
  isPending,
  isFormValid, // Usamos essa prop para desabilitar o upload
  currentImage,
  onRemove,
}: ProductUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentImage || null,
  );

  return (
    <div className="flex flex-col gap-2">
      <UploadButton
        endpoint="imageUploader"
        onBeforeUploadBegin={async (files) => {
          if (!isFormValid) {
            alert(
              "Preencha todos os campos do formulário antes de fazer upload!",
            );
            return []; // Cancela o upload se o formulário não for válido
          }
          const webpFile = await convertImageToWebP(files[0]);
          const previewUrl = URL.createObjectURL(webpFile);
          setImagePreview(previewUrl);
          return [webpFile];
        }}
        onClientUploadComplete={(res) => {
          if (res) {
            const url = res[0].url;
            setImagePreview(url);
            onUpload(url);
          }
        }}
        onUploadError={(error) => {
          console.error("Erro no upload:", error);
        }}
        disabled={!isFormValid || isPending} // Desabilita o botão se o formulário não for válido ou se estiver pendente
      />
      {imagePreview && (
        <div className="mt-2 flex flex-col items-start gap-2">
          <div className="relative">
            {imagePreview.startsWith("blob:") ? (
              <Image
                src={imagePreview}
                alt="Prévia da Imagem"
                className="rounded border"
                width={120}
                height={120}
                unoptimized
              />
            ) : (
              <Image
                src={imagePreview}
                alt="Prévia da Imagem"
                width={120}
                height={120}
                className="rounded border"
              />
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              setImagePreview(null);
              onRemove();
            }}
            disabled={isPending}
          >
            Remover Imagem
          </Button>
        </div>
      )}
    </div>
  );
}
