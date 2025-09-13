import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt, verifyAdmin } from "../../../utils/jwt";
import { hashSync } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request) {
    //  const token = parseAuthCookie(request.headers.get("cookie"));
    try {
        const body = await request.json();
        if (verifyAdmin(request)) {
            const { id, ...rest } = body;
            const updated = await prisma.user.update({ where: { id }, data: rest });
            return NextResponse.json(updated);
        }
    }catch(Error){console.log(Error);}
}


/**
 * Centralized messages
 */
const MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    MISSING_FIELDS: "Missing required fields.",
    USER_EXISTS: (email) => `User already exists with ${email}`,
    USER_CREATED: "User created successfully",
    SERVER_ERROR: "Internal Server Error",
};

/**
 * Authenticate user from JWT in cookies
 * @param {Request} request
 * @returns {object|null} payload
 */
function authenticate(request) {
    const token = parseAuthCookie(request.headers.get("cookie"));
    return token ? verifyJwt(token) : null;
}

/**
 * GET handler - returns authenticated user info
 */
export async function GET(request) {
    try {
    const id = (await params).id;
    const payload = authenticate(request);

    if (!payload) {
        return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    return NextResponse.json(
        { userId: payload.userId, username: payload.email },
        { status: 200 }
    );
}catch(Error){console.log(Error);}
}

export async function DELETE(request, { params }) {
  try {
     if (verifyAdmin(request)) {
    await prisma.user.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "User deleted successfully" });
     }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}