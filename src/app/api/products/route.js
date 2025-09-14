import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

export async function GET() {
  const res =  await prisma.product.findMany({
    include: { category: true, brand: true }  // tags: { include: { tag: true } }tags: { include: { tag: true } }
  })
  return NextResponse.json(res);
}

export async function POST(request) {
  try {
    if (verifyAdmin(request)) {
      const body = await request.json();
      const res = await prisma.product.create({ data: body });
      return NextResponse.json({ data: res}, { status: 201 });
    }
  } catch (Error) {
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    if (verifyAdmin(request)) {
      const body = await request.json();
      const { id, ...rest } = body;
      let prod = await prisma.product.update({ where: { id }, data: rest });
      return NextResponse.json(prod);
    }
  } catch (Error) {
    console.log(Error);
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}
