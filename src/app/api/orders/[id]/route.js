import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseAuthCookie, verifyJwt, verifyAdmin } from "../../utils/jwt";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
try {
    const token = parseAuthCookie(request.headers.get("cookie")) || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const user = verifyJwt(token || "");
    if (!user?.userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const id = (await params).id;
const order = await prisma.order.findUnique({ where: { id: Number(id) },
include: { items: { include: { product: true } }, shipping: true, payment: true },
});
if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
if (order.userId !== Number(user.userId) && !(await verifyAdmin(request))) {
    return NextResponse.json({ error: "You cannot view this order" }, { status: 403 });
}
return NextResponse.json(order);
} catch (Error) {
    console.log(Error);
    return NextResponse.json({ error: "Unable to load order" }, { status: 500 });
}
}
