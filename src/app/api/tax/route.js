import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('taxId'));
    if (id) {
      const tax = await prisma.tax.findUnique({
        where: {
          id: id
        }
      })
      return NextResponse.json({ data: tax ? tax : {} }, { status: 200 });
    }
    const res = await prisma.tax.findMany();
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // const isNameExist = await prisma.tax.findUnique({ where: { name: body.name } });
    // if (isNameExist) {
    //   return NextResponse.json({ error: "Tax name already exist!" }, { status: 401 });
    // }
    const res = await prisma.tax.create({ data: body })
    return NextResponse.json({ data: res }, { status: 201 });
  } catch (err) {
    console.log('.........', err);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function PUT(request) {

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('taxId'));
    const tag = await prisma.tax.findUnique({
      where: {
        id: id
      }
    })
    if (!tag) {
      return NextResponse.json({ error: 'Tax does not exist' }, { status: 404 });
    }
    const newTag = await prisma.tax.update({
      data: {
        name: body.name,
        description: body.description,
        value: body.value
      },
      where: {
        id: id
      }
    });
    return NextResponse.json({ message: 'Tax updated', newTag }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
