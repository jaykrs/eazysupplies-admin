import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin, getUserId } from "../../utils/jwt";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const payload = await authenticate(request);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = Number(searchParams.get("type"));
    const documentType = searchParams.get("namePath");
    const orderId = Number(searchParams.get("orderId"));
    if (![1, 2, 3].includes(type) || !Number.isInteger(orderId) || orderId < 1) {
      return NextResponse.json({ error: "Invalid upload parameters" }, { status: 400 });
    }
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be smaller than 10 MB" }, { status: 413 });
    }

    const root = process.env.FILE_PATH || path.join(process.cwd(), "public");
    const folder = type === 1 ? "uploads" : "private";
    const dir = path.join(root, folder);
    fs.mkdirSync(dir, { recursive: true });

    const originalName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "");
    const extension = path.extname(originalName).toLowerCase();
    const allowedExtensions = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp"]);
    if (!allowedExtensions.has(extension)) {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
    }
    const prefix = documentType === "transport"
      ? "performa-transportReport"
      : documentType === "delivery"
        ? "performa-delivery"
        : `performa-order-${orderId}-${Date.now()}`;
    const fileName = documentType === "transport" || documentType === "delivery"
      ? `${prefix}${orderId}${extension}`
      : `${prefix}${extension}`;
    await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));

    const userId = await getUserId(request);
    const publicPath = `/${folder}/${fileName}`;
    const existing = await prisma.assets.findFirst({ where: { name: fileName } });
    const asset = existing
      ? await prisma.assets.update({ where: { id: existing.id }, data: { path: publicPath, author: String(userId), type: "private" } })
      : await prisma.assets.create({
          data: { name: fileName, type: "private", path: publicPath, author: String(userId), tag: fileName },
        });

    return NextResponse.json({
      message: "File uploaded successfully",
      path: publicPath,
      assetId: asset.id,
      url: `https://api.eazysupplies.com/api/file?file=${encodeURIComponent(fileName)}`,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
