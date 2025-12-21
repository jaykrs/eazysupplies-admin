import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin, getUserId } from "../../utils/jwt"; // adjust import path if needed
import { MESSAGES } from "../../utils/statusConstant";       // adjust import path if needed

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
    const userId = await getUserId(request);

    let addresses;
     if (userId) {
      addresses = await prisma.address.findMany({ where: { userId } });
    } 
    return NextResponse.json({ data: addresses || [] }, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}