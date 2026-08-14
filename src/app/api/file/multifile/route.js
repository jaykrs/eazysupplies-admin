import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../../utils/jwt";

const prisma = new PrismaClient();

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function POST(request) {
  const payload = await authenticate(request);
  if (!payload) return unauthorized();

  const { searchParams } = new URL(request.url);
  const type = Number(searchParams.get("type"));
  const fileNameWith = searchParams.get("fileNameWith");
  const orderId = Number(searchParams.get("orderId"));
  const userId = payload.userId;
console.log(type, fileNameWith, orderId);
  if (!userId) {
    return NextResponse.json(
      { error: "No User available" },
      { status: 400 }
    );
  }

  if (!verifyAdmin(request) || !type) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const dir =
      type === 1
        ? path.join(process.env.FILE_PATH, "uploads")
        : path.join(process.env.FILE_PATH, "private");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const savedAssets = [];
   let i=1;
    for (const file of files) {
      if (!(file instanceof File)) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/\s+/g, "");
      //const fileName = `${Date.now()}-${Math.random()}-${safeName}`;
      const extension = safeName.substring(safeName.lastIndexOf('.'));
      const fileName = fileNameWith ? `performa-${fileNameWith}${i}-${orderId}` + extension : 'performa-' + safeName;
      const filePath = path.join(dir, fileName);
      i +=1;
      await writeFile(filePath, buffer);

      const publicPath =
        type === 1 ? `/uploads/${fileName}` : type === 2? `/invoice/${fileName}` : `/private/${fileName}`;

      const asset = await prisma.assets.create({
        data: {
          name: fileName,
          type: type === 1 ? "public" : "private",
          path: publicPath,
          author: userId.toString(),
          tag: fileName,
        },
      });

      savedAssets.push("https://api.eazysupplies.com/api/file?userId=" + userId + "&file=" + fileName);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      assets: savedAssets,
    });
  } catch (error) {
    console.log("File upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
