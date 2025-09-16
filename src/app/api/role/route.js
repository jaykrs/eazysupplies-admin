
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    if (verifyAdmin(request)) {
      const { searchParams } = new URL(request.url);
      const id = Number(searchParams.get('roleId'));
      let res;
      if (id) {
        const res = await prisma.role.findUnique({
          where: {
            id: id
          }
        })
        return NextResponse.json({ data: res ? res : [] }, { status: 200 });
      }
      res = await prisma.role.findMany();
      return NextResponse.json({ data: res }, { status: 200 });
    } else {
      return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (verifyAdmin(request)) {
      const body = await request.json();
      const isRole = await prisma.role.findUnique({
          where: {
            name : body.name
          }
        })
        if(isRole){
          return NextResponse.json({ error: "role " + body.name + " " + MESSAGES.DATA_EXISTS }, { status: 401 });
        }
      const res = await prisma.role.create({ data: body });
      return NextResponse.json({ data: res }, { status: 201 });
    } else {
      return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
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
      const res = await prisma.role.update({ where: { id }, data: rest });
      return NextResponse.json(res);
    } else {
      return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
    }
  } catch (Error) {
    console.log(Error);
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}