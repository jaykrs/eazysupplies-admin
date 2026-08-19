import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../utils/jwt";

const prisma = new PrismaClient();

const parseWishlist = (value) => {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isInteger) : [];
  } catch {
    return [];
  }
};

export async function GET(request) {
  const user = await authenticate(request);
  if (!user?.userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const record = await prisma.user.findUnique({ where: { id: Number(user.userId) }, select: { wishlist: true } });
  const ids = parseWishlist(record?.wishlist);
  const products = ids.length
    ? await prisma.product.findMany({ where: { id: { in: ids }, status: true }, include: { category: true, brand: true } })
    : [];
  const order = new Map(ids.map((id, index) => [id, index]));
  products.sort((a, b) => order.get(a.id) - order.get(b.id));
  return NextResponse.json({ data: products });
}

export async function POST(request) {
  const user = await authenticate(request);
  if (!user?.userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  const productId = Number(body.productId || body.id);
  if (!Number.isInteger(productId)) return NextResponse.json({ error: "A valid product is required" }, { status: 400 });
  const product = await prisma.product.findFirst({ where: { id: productId, status: true } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const record = await prisma.user.findUnique({ where: { id: Number(user.userId) }, select: { wishlist: true } });
  const ids = parseWishlist(record?.wishlist);
  if (!ids.includes(productId)) ids.unshift(productId);
  await prisma.user.update({ where: { id: Number(user.userId) }, data: { wishlist: JSON.stringify(ids) } });
  return NextResponse.json({ data: product }, { status: 201 });
}
