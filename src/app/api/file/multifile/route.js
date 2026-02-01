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
  // ✅ DEBUG (remove later)
  console.log("ASSETS API HIT");

  const payload = await authenticate(request);
  if (!payload) return unauthorized();

  const { searchParams } = new URL(request.url);
  const type = Number(searchParams.get("type"));
  const userId = payload.userId;

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

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/\s+/g, "");
      const fileName = `${Date.now()}-${Math.random()}-${safeName}`;
      const filePath = path.join(dir, fileName);

      await writeFile(filePath, buffer);

      const publicPath =
        type === 1 ? `/uploads/${fileName}` : `/private/${fileName}`;

      const asset = await prisma.assets.create({
        data: {
          name: fileName,
          type: type === 1 ? "public" : "private",
          path: publicPath,
          author: userId.toString(),
          tag: fileName,
        },
      });

      savedAssets.push(asset);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      assets: savedAssets,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
