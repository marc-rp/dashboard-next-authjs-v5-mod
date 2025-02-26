import { NextResponse } from "next/server";
import { Readable } from "stream";
import formidable, { File as FormidableFile } from "formidable";
import { saveFile } from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: false, // desabilita o bodyParser para lidar com form-data
  },
};

export async function POST(req: Request) {
  // Converte o corpo da requisição em um buffer
  const buffer = Buffer.from(await req.arrayBuffer());
  // Converte o buffer em um stream para que o formidable possa processá-lo
  const stream = Readable.from(buffer);

  const form = formidable({ multiples: false });

  return new Promise((resolve) => {
    form.parse(stream as any, async (err, _fields, files) => {
      if (err) {
        return resolve(
          NextResponse.json({ error: err.message }, { status: 500 }),
        );
      }
      // Garante que você esteja lidando com um único arquivo
      const fileData = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!fileData) {
        return resolve(
          NextResponse.json(
            { error: "Nenhum arquivo enviado." },
            { status: 400 },
          ),
        );
      }
      // Converta para o tipo do formidable para acessar a propriedade filepath
      const formidableFile = fileData as FormidableFile;
      try {
        // file.filepath (ou file.path) contém o caminho temporário do arquivo
        const secure_url = await saveFile(FormidableFile.filepath);
        resolve(NextResponse.json({ url: secure_url }, { status: 200 }));
      } catch (error: any) {
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      }
    });
  });
}
