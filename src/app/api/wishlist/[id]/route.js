import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../utils/jwt";

const prisma = new PrismaClient();

const parseWishlist = (value) => {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isInteger) : [];
  } catch {
    return [];
  }
};

export async function DELETE(request, { params }) {
  const user = await authenticate(request);
  if (!user?.userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const productId = Number((await params).id);
  const record = await prisma.user.findUnique({ where: { id: Number(user.userId) }, select: { wishlist: true } });
  const ids = parseWishlist(record?.wishlist).filter((id) => id !== productId);
  await prisma.user.update({ where: { id: Number(user.userId) }, data: { wishlist: JSON.stringify(ids) } });
  return NextResponse.json({ message: "Product removed from wishlist" });
}
