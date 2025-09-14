import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
    const category = await prisma.category.findUnique({
        where: { id: Number(id) }, 
        include: {
            products: true,
        },
    });
return NextResponse.json(category);
} catch (Error) {
    console.log(Error);
}
}

