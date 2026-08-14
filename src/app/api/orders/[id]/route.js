import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../../utils/jwt";

const prisma = new PrismaClient();

// 📌 GET /api/orders/[id]

export async function GET(request, { params }) {
  try {
    const user = await authenticate(request);
    if (!user?.userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const id = (await params).id;

    const order = await prisma.order.findFirst({
      where: { id: Number(id) },
      include: {
        user: true,
        items: { include: { product: true } },
        shipping: true,
        payment: true,
      },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.userId !== Number(user.userId) && !(await verifyAdmin(request))) {
      return NextResponse.json({ error: "You cannot view this order" }, { status: 403 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// export async function GET(_, { params }) {
//   try {
//     const id = Number( await params?.id);
//     const order = await prisma.order.findUnique({
//       where: { id },
//       include: {
//         user: true,
//         items: { include: { product: true } },
//         shipping: true,
//         payment: true,
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json(order);
//   } catch (error) {
//     console.error("GET /orders/[id] error:", error);
//     return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
//   }
// }

// 📌 PUT /api/orders/[id]
export async function PUT(request, { params }) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const id = Number((await params).id);
    const body = await request.json();

    const { status, approved, deliveryAgent, jsonData } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        approved,
        deliveryAgent,
        jsonData,
      },
      include: {
        user: true,
        items: { include: { product: true } },
        shipping: true,
        payment: true,
      },
    }); 

    return NextResponse.json(order);
  } catch (error) {
    console.error("PUT /orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// 📌 DELETE /api/orders/[id]
export async function DELETE(request, { params }) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const id = Number((await params).id);

    // Prisma will delete order items via cascade if set up in schema,
    // else we must delete them manually before deleting the order.
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("DELETE /orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
