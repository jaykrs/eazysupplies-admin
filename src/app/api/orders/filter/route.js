import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../utils/jwt";
import { MESSAGES } from "../../utils/statusConstant";
import { error } from "console";

const prisma = new PrismaClient();

// 📌 GET /api/orders?page=1&limit=10&sortBy=createdAt&order=desc&status=PENDING
export async function GET(request) {
    try {
        const payload = await authenticate(request);
        if (!payload) {
            return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const id = Number(searchParams.get('userId'));
        if (!email && !id) {
            return NextResponse.json({ error: "userID or email is missing!" }, { status: 401 });
        }
        let userDetails;
        if (email) {
            userDetails = await prisma.user.findUnique({ where: { email: email } });
        }
        const orders = await prisma.order.findMany({
            where: {
                userId: id ? Number(id) : userDetails.id,
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
        return NextResponse.json({ data: orders, tax }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}