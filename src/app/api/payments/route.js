import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin, authenticate } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";

const prisma = new PrismaClient();

const handleError = (error) => {
  console.error(error);
  return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
};

const unauthorized = () =>
  NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });

export async function GET(request) {
  const isUser = authenticate(request);
  if (!isUser) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("paymentId"));
    const userId = Number(searchParams.get("userId"));
    const orderId = Number(searchParams.get("orderId"));
    const withCookies = searchParams.get('withCookies');

    let result;

    if (id) {
      result = await prisma.payment.findUnique({
        where: { id },
        include: { user: true, order: true },
      });
    } else if (userId) {
      result = await prisma.payment.findMany({
        where: { userId },
        include: { user: true, order: true },
      });
    } else if (orderId) {
      result = await prisma.payment.findUnique({
        where: { orderId },
        include: { user: true, order: true },
      });
    } else if (withCookies) {
      result = await prisma.payment.findMany({
        where: { userId: isUser.userId },
        include: { user: true, order: true },
      });
    } else {
      result = await prisma.payment.findMany({
        include: { user: true, order: true },
      });
    }

    return NextResponse.json({ data: result || [] }, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request) {
  try {
    if (!verifyAdmin(request)) return unauthorized();
    const body = await request.json();
    const created = await prisma.payment.create({ data: body });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("paymentId"));
    const userId = Number(searchParams.get("userId"));
    const paymentStatus = searchParams.get("paymentStatus");
     const body = await request.json();
    //  const validStatuses = ["offline", "cod", "online"];
    const validStatuses = ["OFF", "UPI", "CC","NB"];
    // user updating their payment status
    if (
      id &&
      userId &&
      await authenticate(request) &&
      validStatuses.includes(paymentStatus)
    ) {
      const updated = await prisma.payment.update({
        where: { id, userId },
        data: { status: paymentStatus,  },
      });
      return NextResponse.json({ data: updated }, { status: 200 });
    }

    // admin update via request body
    if (verifyAdmin(request)) {
      console.log("file",body.file);
      const updated = await prisma.payment.update({
        where: { id: Number(id) },
        data: {
          orderId: Number(body.orderId),
          amount: Number(body.amount),
          method: body.method,
          status: body.status,
          transectionid: body.transactionid ? body.transactionid.toString() : "",
          file: body.file
        },
      });
      if(updated.status == "SUCCESS"){
         let order = await prisma.order.update({where :{id : Number(body.orderId)}, data: {status: "PAID"}});
      }
      return NextResponse.json({ data: updated }, { status: 200 });
    }

    return unauthorized();
  } catch (err) {
    console.log('............err', err?.message);
    return NextResponse.json({ err }, { status: 500 });
  }
}
