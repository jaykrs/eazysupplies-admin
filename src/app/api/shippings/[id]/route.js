import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
const shipping = await prisma.shipping.findUnique({ where: { id: Number(id) } });
return NextResponse.json(shipping);
} catch (Error) {
    console.log(Error);
}
}
