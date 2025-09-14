import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant"; 
const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json(await prisma.role.findMany());
}

export async function POST(request) {
   try {
    if(verifyAdmin(request)) {
    const body = await request.json();
  return NextResponse.json(await prisma.role.create({ data: body }), { status: 201 });
    }}
 catch (Error) {
    return NextResponse.json(
                { error: MESSAGES.SERVER_ERROR },
                { status: 500 }
            );
}
}

export async function PUT(request) {
   try {
    if(verifyAdmin(request)) {
    const body = await request.json();
  const { id, ...rest } = body;
  return NextResponse.json(await prisma.role.update({ where: { id }, data: rest }));
  }}
 catch (Error) {
    return NextResponse.json(
                { error: MESSAGES.SERVER_ERROR },
                { status: 500 }
            );
}
}
