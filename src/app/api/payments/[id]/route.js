import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../utils/jwt";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
    const unauthorized = () =>
        NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });
    const isUser = authenticate(request);
    if (!isUser) return unauthorized();
    try {
        const id = (await params).id;
        const payment = await prisma.payment.findUnique({ where: { id: Number(id) } });
        return NextResponse.json(payment);
    } catch (Error) {
        console.log(Error);
    }
}
