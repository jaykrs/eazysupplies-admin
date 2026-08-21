import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../../utils/jwt";
import { MESSAGES } from "../../utils/statusConstant";

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const payload = await authenticate(request);
        if (!payload || !(await verifyAdmin(request))) {
            return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
        }

        // Fetch all users along with their orders
        const usersWithOrders = await prisma.user.findMany({
            include: {
                orders: {
                    include: {
                        items: true,
                        shipping: true,
                        payment: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    }
                }
            }
        });

        return NextResponse.json({ data: usersWithOrders }, { status: 200 });

    } catch (err) {
        console.error("Error fetching users with orders:", err);
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        if (await verifyAdmin(request)) {
            const body = await request.json();
            const { id, ...rest } = body;
            const orderItemDetails = await prisma.orderItem.findUnique({where : {id}});
            if (!orderItemDetails) return NextResponse.json({ error: "Order item not found" }, { status: 404 });
            let prod = await prisma.orderItem.update({ where: { id }, data: {backlogquantity: orderItemDetails.quantity, ...rest} });
            return NextResponse.json(prod);
        }
    } catch (Error) {
        console.log('error', Error);
        return NextResponse.json(
            { error: MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}
