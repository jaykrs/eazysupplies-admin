import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../../../utils/jwt";
import { MESSAGES } from "../../../utils/statusConstant";
import { OrderStatus } from "../../../utils/statusConstant";
const prisma = new PrismaClient();
export async function GET(request) {
    try {
        const payload = await verifyAdmin(request);
        if (!payload) {
            return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
        }
        const orders = await prisma.order.findMany({
            where: {
                userId: payload?.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        const result = OrderStatus.reduce((acc, status) => {
            acc[status] = statusCounts[status] || 0;
            return acc;
        }, {});
        const product = await prisma.product.findMany();
        const user = await prisma.user.findMany();
        const brand = await prisma.brand.findMany();
        const category = await prisma.category.findMany();
        const payloadData = await authenticate(request);
        const userDetails = await prisma.user.findUnique({where: { id: Number(payloadData?.userId)}});
        return NextResponse.json({ ...result, TOTAL: orders.length, PRODUCT: product.length, USER: user.length, BRAND: brand.length, CATEGORY: category.length, NAME: userDetails?.name, EMAIL: payloadData?.email }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}
