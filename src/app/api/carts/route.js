import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken, verifyAdmin } from "../../api/utils/jwt";

const prisma = new PrismaClient();

// Helper function for error responses
function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// GET: Fetch all carts (Admin only)
export async function GET(request) {
  try {
    const isAdmin = verifyAdmin(request);
    if (!isAdmin) {
      return errorResponse("Unauthorized access", 403);
    }

    const carts = await prisma.cart.findMany({
      include: { items: true },
    });

    return NextResponse.json(carts);
  } catch (error) {
    console.error("GET /cart error:", error);
    return errorResponse("Failed to fetch carts", 500);
  }
}

// POST: Create a new cart for the logged-in user
export async function POST(request) {
  try {
    const payload = getUserFromToken(request);
    if (!payload) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const newCart = await prisma.cart.create({
      data: { ...body, userId: payload.userId },
    });

    return NextResponse.json(newCart, { status: 201 });
  } catch (error) {
    console.error("POST /cart error:", error);
    return errorResponse("Failed to create cart", 500);
  }
}

// PUT: Update an existing cart (must belong to logged-in user)
export async function PUT(request) {
  try {
    const payload = getUserFromToken(request);
    if (!payload) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return errorResponse("Cart ID is required", 400);
    }

    const updatedCart = await prisma.cart.update({
      where: { id },
      data: { ...rest, userId: payload.userId },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("PUT /cart error:", error);
    return errorResponse("Failed to update cart", 500);
  }
}
