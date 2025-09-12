import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json(await prisma.category.findMany());
}

export async function POST(request) {
  const body = await request.json();
  let cat = await prisma.category.create({ data: body });
  return NextResponse.json(cat, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const { id, ...rest } = body;
  let cat = await prisma.category.update({ where: { id }, data: rest })
  return NextResponse.json(cat);
}
