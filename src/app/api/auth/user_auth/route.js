import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt, verifyAdmin } from "../../utils/jwt";
import { hashSync } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Centralized messages
 */
const MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    MISSING_FIELDS: "Missing required fields.",
    USER_EXISTS: (email) => `User already exists with ${email}`,
    USER_CREATED: "User created successfully",
    SERVER_ERROR: "Internal Server Error"
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

export async function GET(request) {
    try {
        if (verifyAdmin(request)) {
            const { searchParams } = new URL(request.url);
            const id = Number(searchParams.get('userId'));
            let res;
            if (id) {
                const res = await prisma.user.findUnique({
                    where: {
                        id: id
                    },
                    include: { role: true }
                })
                return NextResponse.json({ data: res ? res : [] }, { status: 200 });
            }
            res = await prisma.user.findMany({ include: { role: true } });
            return NextResponse.json({ data: res }, { status: 200 });
        }
        else {
            return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
        }
    } catch (err) {
        console.log('.............', err);
        return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        if (verifyAdmin(request)) {
            const body = await request.json();
            const {
                name,
                email,
                password,
                countryCode,
                phone,
                role
            } = body;
            if (!name || !email || !password || !phone || !countryCode || !role) {
                return NextResponse.json(
                    { error: MESSAGES.MISSING_FIELDS },
                    { status: 400 }
                );
            }
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return NextResponse.json(
                    { error: MESSAGES.USER_EXISTS(email) },
                    { status: 409 }
                );
            }
            const hashedPassword = hashSync(password, 10);
            let userRole = await prisma.role.findUnique({ where: { name: role } });
            if (!userRole) {
                return NextResponse.json({ error: role + " not exist, please contact to admin!" }, { status: 401 });
            }
            let random = 123456;
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    countryCode,
                    phone: `${phone}`,
                    status: false,
                    roleId: userRole.id,
                    otp: random
                },
            });
            return NextResponse.json(
                { message: MESSAGES.USER_CREATED, email: newUser.email },
                { status: 201 }
            );
        } else {
            return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
        }
    } catch (error) {
        console.log('........', error)
        console.error("[USER_POST_ERROR]", error);
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
            let prod = await prisma.product.update({ where: { id }, data: rest });
            return NextResponse.json(prod);
        } else {
            return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
        }
    } catch (Error) {
        console.log(Error);
        return NextResponse.json(
            { error: MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}
