import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { MESSAGES } from "../../../utils/statusConstant";

const prisma = new PrismaClient();

const handleError = (error) => {
  console.error(error);
  return NextResponse.json(
    { error: MESSAGES.SERVER_ERROR },
    { status: 500 }
  );
};

export async function PUT(request) {
  try {
    const body = await request.json(); // ✅ fixed

    const paymentStatusValid = ["SUCCESS", "FAILED"];

    if (
      !paymentStatusValid.includes(body.status) ||
      !body.orderId ||
      !body.transectionid
    ) {
      return NextResponse.json(
        { msg: "Improper data" },
        { status: 400 }
      );
    }

    const updated = await prisma.payment.updateMany({
      where: {
        orderId: body.orderId
      },
      data: {
        status: body.status,
         transectionid: body.transectionid,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { msg: "Payment not found" },
        { status: 404 }
      );
    }
   let order = await prisma.order.update({where: {id: Number(body?.orderId)}, data: {status: body.status}});
    return NextResponse.json(
      { msg: "Payment updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return handleError(err);
  }
}
