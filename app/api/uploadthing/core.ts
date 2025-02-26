import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "@/lib/auth";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // Define o caminho para a pasta public/uploads
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      try {
        // Faz o download do arquivo usando fetch
        const res = await fetch(file.ufsUrl);
        if (!res.ok) {
          console.error("Erro ao baixar o arquivo:", res.statusText);
          throw new Error("Failed to download file");
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Converte a imagem para WebP utilizando o sharp
        const webpBuffer = await sharp(buffer).toFormat("webp").toBuffer();

        // Cria um novo nome para o arquivo com extensão .webp
        const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
        const newFileName = `${fileNameWithoutExt}.webp`;
        const filePath = path.join(uploadsDir, newFileName);

        // Salva o arquivo convertido
        fs.writeFileSync(filePath, webpBuffer);
        console.log("Arquivo salvo em:", filePath);

        return {
          uploadedBy: metadata.userId,
          localPath: `/uploads/${newFileName}`,
        };
      } catch (error) {
        console.error("Erro ao salvar o arquivo:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
