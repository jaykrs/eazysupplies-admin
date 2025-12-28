import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../../utils/jwt";
import { MESSAGES } from "../../utils/statusConstant";
import { error } from "console";
import { unauthorized } from "next/navigation";

export async function GET(request) {
    try {
        const payload = await authenticate(request);
        if (!payload) {
            return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
        }
        const orders = await prisma.order.findMany({
            where: {
                userId: payload?.userId,
            },
            include: {
                user: true,
                items: {
                    include: {
                        product: true, // 👈 this includes product details inside each item
                    },
                },
                shipping: true,
                payment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const tax = await prisma.tax.findMany();
        const deliveryAgent = await prisma.deliveryAgent.findMany();
        return NextResponse.json({ data: orders, tax, deliveryAgent }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}
