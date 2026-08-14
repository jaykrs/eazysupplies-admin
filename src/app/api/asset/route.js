import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../utils/jwt"; // adjust import path if needed
import { MESSAGES } from "../utils/statusConstant";       // adjust import path if needed

const prisma = new PrismaClient();

const handleError = (error) => {
    console.error(error);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
};

const unauthorized = () =>
    NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });

// GET - Fetch all assets
export async function GET(request) {
    try {
        if (!authenticate(request)) return unauthorized();

        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get("id"));
        const userId = Number(searchParams.get("userId"));
        const name = Number(searchParams.get("name"));
        let assets;
        if (id) {
            assets = await prisma.assets.findUnique({ where: { id: Number(id) } });
        }
        else if (userId) {
            assets = await prisma.assets.findMany({ where: { author: Number(id) } });
        }
        else if (name) {
            assets = await prisma.assets.findMany({ where: { name: name } });
        }
        else
            assets = await prisma.assets.findMany();
        return NextResponse.json(assets);
    } catch (err) {
    return handleError(err);
  }
}

// POST - Create new asset
export async function POST(request) {
    if (!authenticate(request)) return unauthorized(); 
    try {
        const body = await request.json();
        const asset = await prisma.assets.create({ data: body });
        return NextResponse.json(asset, { status: 201 });
    } catch (err) {
    return handleError(err);
  }
}
