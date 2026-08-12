import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const id = (await params).id;
const product = await prisma.product.findUnique({ where: { id: Number(id) },
include: { category: true, brand: true },
});
return NextResponse.json(product);
} catch (Error) {
    console.log(Error);
}
}

export async function DELETE(request, { params }) {
  try {
    const id = Number((await params).id);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    const isReferenced = error?.code === "P2003";
    return NextResponse.json(
      { error: isReferenced ? "This product is used by an order and cannot be deleted." : "Unable to delete product." },
      { status: isReferenced ? 409 : 500 }
    );
  }
}
