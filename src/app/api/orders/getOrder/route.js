import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../../utils/jwt";
import { MESSAGES } from "../../utils/statusConstant";
const prisma = new PrismaClient();
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
                // user: true,
                items: true,
                shipping: true,
                payment: true,
                items:{ include: {product: true}}
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const tax = await prisma.tax.findMany();
        const deliveryAgent = await prisma.deliveryAgent.findMany();

        const uniqueProductsMap = new Map();
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const product = item?.product;
                    if (product && !uniqueProductsMap.has(product.id)) {
                        uniqueProductsMap.set(product.id, product);
                    }
                    item.productName= product.name;
                    delete item.product;
                });
            }
        });
        const products = Array.from(uniqueProductsMap.values());
        return NextResponse.json({ data: orders, tax, deliveryAgent,products }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}
