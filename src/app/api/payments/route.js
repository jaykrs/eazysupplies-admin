import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json(await prisma.payment.findMany());
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json(await prisma.payment.create({ data: body }), { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const { id, ...rest } = body;
  return NextResponse.json(await prisma.payment.update({ where: { id }, data: rest }));
}
