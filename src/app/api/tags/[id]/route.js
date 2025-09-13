import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
const tag = await prisma.tag.findUnique({ where: { id: Number(id) } });
return NextResponse.json(tag);
} catch (Error) {
    console.log(Error);
}
}
