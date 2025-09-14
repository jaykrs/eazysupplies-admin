import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('categoryId'));
    let res;
    if (id) {
      const res = await prisma.category.findUnique({
        where: {
          id: id
        }
      })
      return NextResponse.json({ data: res ? res : [] }, { status: 200 });
    }
    res = await prisma.category.findMany();
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
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
