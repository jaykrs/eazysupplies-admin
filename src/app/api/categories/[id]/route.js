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

export async function DELETE(request, { params }) {
  try {
    const id = Number((await params).id);
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    const isReferenced = error?.code === "P2003";
    return NextResponse.json(
      { error: isReferenced ? "Move or delete this category's products before deleting it." : "Unable to delete category." },
      { status: isReferenced ? 409 : 500 }
    );
  }
}
