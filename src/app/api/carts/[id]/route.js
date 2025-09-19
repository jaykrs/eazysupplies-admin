import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "../../utils/jwt";

const prisma = new PrismaClient();

// GET: Fetch a cart by ID (only if user is authenticated)
export async function GET(request, { params }) {
  try {
    const payload = getUserFromToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Invalid or missing cart ID" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { id },
      include: { items: true }, // optional, include related items
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("GET /cart/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}


