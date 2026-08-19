import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../utils/jwt"; // adjust import path if needed
import { MESSAGES } from "../utils/statusConstant";       // adjust import path if needed

const prisma = new PrismaClient();

const handleError = (error) => {
  console.error(error);
  return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
};

const unauthorized = () =>
  NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });

// 🟢 GET — get all or by userId or id
export async function GET(request) {
  try {
    if (! await authenticate(request)) return unauthorized();

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    const userId = Number(searchParams.get("userId"));

    let addresses;
    if (id) {
      addresses = await prisma.address.findFirst({ where: { id, ...(await verifyAdmin(request) ? {} : { userId: Number((await authenticate(request)).userId) }) } });
    } else if (userId) {
      addresses = await prisma.address.findMany({ where: { userId } });
    } else {
      if(await verifyAdmin(request))
      addresses = await prisma.address.findMany();
    }

    return NextResponse.json({ data: addresses || [] }, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

// 🟡 POST — create new address
export async function POST(request) {
  try {
    if (! await authenticate(request)) return unauthorized();
    let payload = await authenticate(request);
    let body = await request.json();
    body.userId = payload.userId;
    const created = await prisma.address.create({ data: body });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

// 🟠 PUT — update existing address
export async function PUT(request) {
  try {
    if (! await authenticate(request)) return unauthorized();

    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing address id" }, { status: 400 });
    }

    const user = await authenticate(request);
    const existing = await prisma.address.findFirst({ where: { id, ...(await verifyAdmin(request) ? {} : { userId: Number(user.userId) }) } });
    if (!existing) return NextResponse.json({ error: "Address not found" }, { status: 404 });
    const updated = await prisma.address.update({
      where: { id: existing.id },
      data: rest,
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

// 🔴 DELETE — delete address by id
export async function DELETE(request) {
  try {
    const user = await authenticate(request);
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ error: "Missing address id" }, { status: 400 });
    }

    const existing = await prisma.address.findFirst({ where: { id, ...(await verifyAdmin(request) ? {} : { userId: Number(user.userId) }) } });
    if (!existing) return NextResponse.json({ error: "Address not found" }, { status: 404 });
    await prisma.address.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: "Address deleted" }, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
