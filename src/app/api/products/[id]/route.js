import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
    console.log(id);
const product = await prisma.product.findUnique({ where: { id: Number(id) },
include: { category: true, brand: true },
});
return NextResponse.json(product);
} catch (Error) {
    console.log(Error);
}
}
