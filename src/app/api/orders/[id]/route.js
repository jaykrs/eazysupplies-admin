import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
const order = await prisma.order.findUnique({ where: { id: Number(id) },
include: { items: true, shipping: true, payment: true },
});
return NextResponse.json(order);
} catch (Error) {
    console.log(Error);
}
}
