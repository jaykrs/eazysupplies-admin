import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('tagId'));
    if (id) {
      const tag = await prisma.tag.findUnique({
        where: {
          id: id
        }
      })
      return NextResponse.json({ data: tag ? tag : [] }, { status: 200 });
    }
    const res = await prisma.tag.findMany();
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const isNameExist = await prisma.tag.findUnique({ where: { name: body.name } });
    if (isNameExist) {
      return NextResponse.json({ error: "Tag name already exist!" }, { status: 401 });
    }
    const res = await prisma.tag.create({ data: body })
    return NextResponse.json({ data: res }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function PUT(request) {

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('tagId'));

    const tag = await prisma.tag.findUnique({
      where: {
        id: id
      }
    })
    if (!tag) {
      return NextResponse.json({ error: 'Tag does not exist' }, { status: 404 });
    }
    const newTag = await prisma.tag.update({
      data: {
        description: body.description
      },
      where: {
        id: id
      }
    });
    return NextResponse.json({ message: 'Tag updated', newTag }, { status: 200 });
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
