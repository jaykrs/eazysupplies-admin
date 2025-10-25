import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../utils/jwt" ; // adjust import path if needed
import { MESSAGES } from "../../utils/statusConstant";       // adjust import path if needed

const prisma = new PrismaClient();

const handleError = (error) => {
    console.error(error);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
};

const unauthorized = () =>
    NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });


// GET - Fetch single asset
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const asset = await prisma.assets.findUnique({ where: { id: Number(id) } });
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    return NextResponse.json(asset);
  } catch (err) {
    return handleError(err);
  }
}

// PUT - Update asset
export async function PUT(request, { params }) {
  const { id } = params;
  if (!authenticate(request)) return unauthorized();
  try {
    const body = await request.json();
    const asset = await prisma.assets.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(asset);
  } catch (err) {
    return handleError(err);
  }
}

// DELETE - Remove asset
export async function DELETE(request, { params }) {
  const { id } = params;
  if (!authenticate(request)) return unauthorized();
  try {
    await prisma.assets.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Asset deleted successfully" });
  } catch (err) {
    return handleError(err);
  }
}
