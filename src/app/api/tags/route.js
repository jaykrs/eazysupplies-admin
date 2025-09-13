import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
const prisma = new PrismaClient();

const MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  MISSING_FIELDS: "Missing required fields.",
  USER_EXISTS: (email) => `User already exists with ${email}`,
  USER_CREATED: "User created successfully",
  SERVER_ERROR: "Internal Server Error",
};
export async function GET() {
  return NextResponse.json(await prisma.tag.findMany());
}

export async function POST(request) {
  if (verifyAdmin(request)) {
    const body = await request.json();
    return NextResponse.json(await prisma.tag.create({ data: body }), { status: 201 });
  }
  else
    return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 500 });
}

export async function PUT(request) {
  if (verifyAdmin(request)) {
    const body = await request.json();
    const { id, ...rest } = body;
    return NextResponse.json(await prisma.tag.update({ where: { id }, data: rest }));
  }
  else
    return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 500 });
}
