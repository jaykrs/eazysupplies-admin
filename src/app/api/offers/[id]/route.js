import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../../utils/jwt"; // adjust import path if needed
import { MESSAGES } from "../../utils/statusConstant";       // adjust import path if needed

const prisma = new PrismaClient();

const handleError = (error) => {
    console.error(error);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
};

const unauthorized = () =>
    NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });

// GET – Fetch a single offer
export async function GET(request, { params }) {
    const { id } = params;
    if (!authenticate(request)) return unauthorized();
    try {
        const offer = await prisma.offers.findUnique({
            where: { id: Number(id) },
        });
        if (!offer)
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        return NextResponse.json(offer);
    } catch (err) {
        return handleError(err);
    }
}

// PUT – Update an offer
export async function PUT(request, { params }) {
    const { id } = params;
    if (!authenticate(request)) return unauthorized();
    if (verifyAdmin(request))
        try {
            const body = await request.json();
            const offer = await prisma.offers.update({
                where: { id: Number(id) },
                data: body,
            });
            return NextResponse.json(offer);
        } catch (err) {
            return handleError(err);
        }
}

// DELETE – Remove an offer
export async function DELETE(request, { params }) {
    const { id } = params;
     if (!authenticate(request)) return unauthorized();
    try {
        if (verifyAdmin(request)) {
            await prisma.offers.delete({ where: { id: Number(id) } });
            return NextResponse.json({ message: "Offer deleted successfully" });
        }
    } catch (err) {
        return handleError(err);
    }
}
