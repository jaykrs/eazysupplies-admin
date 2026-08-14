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
        const id = Number(searchParams.get('id'));
        let res;
        if (id) {
            const res = await prisma.deliveryAgent.findUnique({
                where: {
                    id: id
                }
            })
            return NextResponse.json({ data: res ? res : [] }, { status: 200 });
        }
        res = await prisma.deliveryAgent.findMany();
        return NextResponse.json({ data: res }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        if (verifyAdmin(request)) {
            const body = await request.json();
            return NextResponse.json(await prisma.deliveryAgent.create({ data: body }), { status: 201 });
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
            return NextResponse.json(await prisma.deliveryAgent.update({ where: { id }, data: rest }));
        }
    } catch (Error) {
        console.log('..........err', Error);
        return NextResponse.json(
            { error: MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}