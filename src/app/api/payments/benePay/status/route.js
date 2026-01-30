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

export async function GET(request) {
  try {
    //const body = await request.json(); // ✅ fixed
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('response'));
     
    // if (
    //   !paymentStatusValid.includes(body.status) ||
    //   !body.orderId ||
    //   !body.transectionid
    // ) {
    //   return NextResponse.json(
    //     { msg: "Improper data" },
    //     { status: 400 }
    //   );
    // }

    // const updated = await prisma.payment.updateMany({
    //   where: {
    //     orderId: body.orderId,
    //     transectionid: body.transectionid,
    //   },
    //   data: {
    //     status: body.status,
    //   },
    // });

    // if (updated.count === 0) {
    //   return NextResponse.json(
    //     { msg: "Payment not found" },
    //     { status: 404 }
    //   );
    // }
    let updatePayment = await prisma.payment.update({where: { id: 1}, data:{
      transectionid: id
    }})
    return NextResponse.json(
      { msg: id, searchParams},
      { status: 200 }
    );
  } catch (err) {
    return handleError(err);
  }
}
