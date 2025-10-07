import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('paymentId'));
    let res;
    if (id) {
       res = await prisma.payment.findUnique({
        where: {
          id: id
        },
        include: { user: true, order: true }
      })
      return NextResponse.json({ data: res ? res : [] }, { status: 200 });
    }
    
    res = await prisma.payment.findMany({
      include: { user: true, order: true },
    });

    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (verifyAdmin(request)) {
      const body = await request.json();
      const res = await prisma.payment.create({ data: body });
      return NextResponse.json({ data: res }, { status: 201 });
    }
  } catch (Error) {
    console.log(Error);
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
      let prod = await prisma.payment.update({ where: { id }, data: rest });
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
