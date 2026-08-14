import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get('supplierId'));
        let res;
        if (id) {
            const res = await prisma.supplier.findUnique({
                where: {
                    id: id
                }
            })
            return NextResponse.json({ data: res ? res : [] }, { status: 200 });
        }
        res = await prisma.supplier.findMany();
        return NextResponse.json({ data: res }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        if (verifyAdmin(request)) {
            const body = await request.json();
            const res = await prisma.supplier.create({ data: body });
            return NextResponse.json({ data: res }, { status: 201 });
        }
    } catch (Error) {
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
            let prod = await prisma.supplier.update({ where: { id }, data: rest });
            return NextResponse.json(prod);
        }
    } catch (Error) {
        console.log(Error);
        return NextResponse.json(
            { error: MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}
