import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
import { unauthorized } from "next/navigation";
const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json(await prisma.shipping.findMany());
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json(await prisma.shipping.create({ data: body }), { status: 201 });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, orderId } = body;
    if (verifyAdmin(request)) {

      let res = await prisma.shipping.update({
        where: { id, orderId }, data: {
          status: body.status,
          assets: body.assets,
          deliveryAgent: body.deliveryAgent
        }
      });
      let orderUpdate = await prisma.order.update({ where: { id: orderId }, data: { status: "SHIPPED", deliveryAgent: Number(body.deliveryAgent) } })
      console.log("order update", orderUpdate, orderId);
      return NextResponse.json({ msg: "Order SHIPPED successfully!" }, { status: 200 });
    }
    return unauthorized();
  } catch (err) {
    console.log('..........err', err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
