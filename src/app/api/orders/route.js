import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 GET /api/orders?page=1&limit=10&sortBy=createdAt&order=desc&status=PENDING
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          user: true,
          items: { include: { product: true } },
          shipping: true,
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error("GET /orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// 📌 POST /api/orders
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items, shipping, payment, jsonData } = body;

    if (!userId || !items?.length) {
      return NextResponse.json(
        { error: "userId and at least one item are required" },
        { status: 400 }
      );
    }

      // ✅ Check if user exists
    const _user = await prisma.user.findUnique({ where: { id: userId } });
    if (!_user) {
      return NextResponse.json(
        { error: `User with ID ${userId} does not exist` },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId,
        jsonData,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            backlogquantity: item.backlogquantity || 0,
            price: item.price,
          })),
        },
        shipping: shipping ? { create: shipping } : undefined,
        payment: payment ? { create: payment } : undefined,
      },
      include: {
        user: true,
        items: { include: { product: true } },
        shipping: true,
        payment: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
