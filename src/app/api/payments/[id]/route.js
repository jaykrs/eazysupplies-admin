import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
const payment = await prisma.payment.findUnique({ where: { id: Number(id) } });
return NextResponse.json(payment);
} catch (Error) {
    console.log(Error);
}
}
