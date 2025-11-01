import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
const prisma = new PrismaClient();

const MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    MISSING_FIELDS: "Missing required fields.",
    USER_EXISTS: (email) => `User already exists with ${email}`,
    USER_CREATED: "User created successfully",
    SERVER_ERROR: "Internal Server Error",
};

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get('offerId');
        const userIdParam = searchParams.get('userId');
        const productIdParam = searchParams.get('productId');

        const now = new Date();
        const userId = userIdParam ? userIdParam.trim() : null;
        const productId = productIdParam ? productIdParam.trim() : null;

        // 1) If offerId provided → fetch single
        if (idParam) {
            const id = Number(idParam);
            const offer = await prisma.offer.findFirst({
                where: {
                    id: id,
                    startDate: { lte: now },
                    endDate: { gte: now },
                },
            });
            return NextResponse.json({ data: offer ? [offer] : [] }, { status: 200 });
        }

        // 2) If userId provided → fetch many for user
        if (userId) {
            const allOffers = await prisma.offer.findMany({
                where: {
                    user: { contains: userId },
                    startDate: { lte: now },
                    endDate: { gte: now },
                },
                orderBy: { createdAt: 'desc' },
            });

            const valid = allOffers.filter((o) => {
                const list = o.user?.split(',').map(s => s.trim());
                return list?.includes(userId);
            });

            return NextResponse.json({ data: valid }, { status: 200 });
        }

        // 3) If productId provided → fetch many for product
        if (productId) {
            const allOffers = await prisma.offer.findMany({
                where: {
                    product: { contains: productId },
                    startDate: { lte: now },
                    endDate: { gte: now },
                },
                orderBy: { createdAt: 'desc' },
            });

            // If you also want to filter by userId when productId given:
            if (userId) {
                const valid2 = allOffers.filter((o) => {
                    const list = o.user?.split(',').map(s => s.trim());
                    return list?.includes(userId);
                });
                return NextResponse.json({ data: valid2 }, { status: 200 });
            }

            return NextResponse.json({ data: allOffers }, { status: 200 });
        }

        // 4) Default: fetch all active offers
        const offers = await prisma.offer.findMany({
            // where: {
            //     startDate: { lte: now },
            //     endDate: { gte: now },
            // },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ data: offers }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        if (verifyAdmin(request)) {
            const body = await request.json();
            const offer = await prisma.offer.create({ data: body })
            return NextResponse.json(offer, { status: 201 });
        }
    } catch (Error) {
        console.log(Error);
        return NextResponse.json(
            { error: MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        if (verifyAdmin(request)) {
            const body = await request.json();
            const { id, ...rest } = body;
            const offer = await prisma.offer.update({ where: { id }, data: rest });
            return NextResponse.json(offer);
        }
    } catch (Error) {
        console.log(Error);
        return NextResponse.json(
            { error: MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}