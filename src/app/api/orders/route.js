import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseAuthCookie, verifyJwt, verifyAdmin } from "../utils/jwt";
const prisma = new PrismaClient();
const recentRequests = new Map();

function getUser(request) {
  const cookieToken = parseAuthCookie(request.headers.get("cookie"));
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return verifyJwt(cookieToken || bearerToken || "");
}

export async function GET(request) {
  const user = getUser(request);
  if (!user?.userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const isAdmin = await verifyAdmin(request);
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const perPage = Math.min(Math.max(Number(searchParams.get("paginate") || searchParams.get("limit")) || 10, 1), 100);
  const where = isAdmin ? {} : { userId: Number(user.userId) };
  const [orders, total] = await Promise.all([prisma.order.findMany({
    where,
    include: { items: { include: { product: true } }, shipping: true, payment: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  }), prisma.order.count({ where })]);
  return NextResponse.json({ data: orders, total, current_page: page, last_page: Math.ceil(total / perPage), per_page: perPage });
}

export async function POST(request) {
  try {
    const user = getUser(request);
    if (!user?.userId) return NextResponse.json({ error: "Please log in before placing an order." }, { status: 401 });
    const idempotencyKey = request.headers.get("idempotency-key");
    if (idempotencyKey && recentRequests.has(idempotencyKey)) {
      return NextResponse.json(recentRequests.get(idempotencyKey), { status: 200 });
    }

    const body = await request.json();
    const requestedItems = Array.isArray(body.items) ? body.items : [];
    if (!requestedItems.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    const productIds = [...new Set(requestedItems.map((item) => Number(item.productId)))];

    const createdOrder = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      const byId = new Map(products.map((product) => [product.id, product]));
      const items = requestedItems.map((item) => {
        const product = byId.get(Number(item.productId));
        const quantity = Number(item.quantity);
        if (!product || !Number.isInteger(quantity) || quantity < 1) throw new Error("INVALID_ITEM");
        if (quantity > product.stock) throw new Error(`OUT_OF_STOCK:${product.name}:${product.stock}`);
        return { productId: product.id, quantity, price: product.price };
      });
      const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const order = await tx.order.create({
        data: {
          userId: Number(user.userId),
          status: "PENDING",
          items: { create: items },
          shipping: { create: {
            address: body.shipping?.address || "",
            city: body.shipping?.city || "",
            state: body.shipping?.state || "NA",
            postalCode: body.shipping?.postalCode || "",
            country: body.shipping?.country || "India",
          } },
          payment: { create: {
            userId: Number(user.userId),
            amount,
            method: body.payment?.method || "COD",
            status: "PENDING",
          } },
        },
        include: { items: { include: { product: true } }, shipping: true, payment: true },
      });
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error(`OUT_OF_STOCK:${byId.get(item.productId)?.name || "Product"}:0`);
      }
      return order;
    });

    if (idempotencyKey) {
      recentRequests.set(idempotencyKey, createdOrder);
      setTimeout(() => recentRequests.delete(idempotencyKey), 5 * 60 * 1000);
    }
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    if (error?.message?.startsWith("OUT_OF_STOCK:")) {
      const [, name, stock] = error.message.split(":");
      return NextResponse.json({ error: `${name} only has ${stock} item(s) available.` }, { status: 409 });
    }
    if (error?.message === "INVALID_ITEM") return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
    console.error("[ORDER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Unable to place the order. Please try again." }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await verifyAdmin(request))) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await request.json();
  const { id, ...rest } = body;
  return NextResponse.json(await prisma.order.update({ where: { id }, data: rest }));
}
