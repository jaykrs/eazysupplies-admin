import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
const product = await prisma.product.findUnique({ where: { id: Number(id) },
include: { category: true, brand: true, tags: { include: { tag: true } } },
});
return NextResponse.json(product);
} catch (Error) {
    console.log(Error);
}
}
