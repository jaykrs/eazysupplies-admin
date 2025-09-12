import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
const brand = await prisma.brand.findUnique({ where: { id: Number(id) } });
return NextResponse.json(brand);
} catch (Error) {
    console.log(Error);
}
}