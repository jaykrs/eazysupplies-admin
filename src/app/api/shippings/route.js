import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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
    console.log("assets", body.assets);
    return NextResponse.json(await prisma.shipping.update({
      where: { id, orderId }, data: {
        status: body.status,
        assets: body.assets,
        deliveryAgent: body.deliveryAgent
      }
    }));
  } catch (err) {
    console.log('..........err', err);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
