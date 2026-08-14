import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../utils/jwt"; // adjust import path if needed
import { MESSAGES } from "../utils/statusConstant";       // adjust import path if needed

const prisma = new PrismaClient();

const handleError = (error) => {
    console.error(error);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
};

const unauthorized = () =>
    NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });

// GET – Fetch all offers
export async function GET(request) {
    try {
        if (!authenticate(request)) return unauthorized();

        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get("id"));
        const userId = Number(searchParams.get("userId"));
        const categoryId = Number(searchParams.get("categoryId"));
        let offers;
        if (id) {
            offers = await prisma.offers.findUnique({ where: { id: Number(id) } });
        }
        else if (userId && categoryId) {
            offers = await prisma.offers.findMany({ where: { userId: Number(userId), categoryId: Number(categoryId) } });
        }
        else if (userId) {
            offers = await prisma.offers.findMany({ where: { userId: Number(userId) } });
        }
        else if (categoryId) {
            offers = await prisma.offers.findMany({ where: { categoryId: Number(categoryId) } });
        }
        else
            offers = await prisma.offers.findMany({
                orderBy: { createdAt: "desc" },
            });
        return NextResponse.json(offers);
    } catch (err) {
    return handleError(err);
  }
}

// POST – Create a new offer
export async function POST(request) {
    try {
        const payload = await authenticate(request);
        if (!payload) return unauthorized();
        if (verifyAdmin(request)) {
            const body = await request.json();
            body.author = payload?.userId.toString();
            const offer = await prisma.offers.create({ data: body });
            return NextResponse.json(offer, { status: 201 });
        }
    } catch (err) {
        console.log('err', err);
    return handleError(err);
  }
}
