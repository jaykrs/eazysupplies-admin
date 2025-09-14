import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const qname = searchParams.get('name');
  return NextResponse.json(await prisma.template.findUnique({
    where: {
      name: qname
    }
  }
  ));
}

const MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  MISSING_FIELDS: "Missing required fields.",
  USER_EXISTS: (email) => `User already exists with ${email}`,
  USER_CREATED: "User created successfully",
  SERVER_ERROR: "Internal Server Error",
};

export async function POST(request) {
  try {
    if (verifyAdmin(request)) {
      const body = await request.json();
      const templ = await prisma.template.create({ data: body });
      return NextResponse.json(templ, { status: 201 });
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
      return NextResponse.json(await prisma.template.update({ where: { id }, data: rest }));
    }
  } catch (Error) {
    console.log(Error);
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}