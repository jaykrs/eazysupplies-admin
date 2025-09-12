import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt, verifyAdmin } from "../utils/jwt";
import { hashSync } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function GET() {
//   return NextResponse.json(await prisma.user.findMany({ include: { role: true } }));
// }

// export async function POST(request) {
//   const body = await request.json();
//   const user = await prisma.user.create({ data: body });
//   return NextResponse.json(user, { status: 201 });
// }

export async function PUT(request) {
    //  const token = parseAuthCookie(request.headers.get("cookie"));
    const payload = authenticate(request);
    if (payload) {
        let userId = payload.userId;
        let emailid = payload.email;
        const body = await request.json();
        if (verifyAdmin(request) || (body.email == emailid && body.id == userId)) {
            const { id, ...rest } = body;
            const updated = await prisma.user.update({ where: { id }, data: rest });
            return NextResponse.json(updated);
        }
    }
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
    const payload = authenticate(request);

    if (!payload) {
        return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    return NextResponse.json(
        { userId: payload.userId, username: payload.email },
        { status: 200 }
    );
}

/**
 * POST handler - creates a new user
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            password,
            countryCode,
            phone,
        } = body;

        console.log('body', body);

        // Validate required fields
        if (!name || !email || !password || !phone || !countryCode) {
            return NextResponse.json(
                { error: MESSAGES.MISSING_FIELDS },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: MESSAGES.USER_EXISTS(email) },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = hashSync(password, 10);

        // Ensure role exists, fallback to 'user'
        let userRole = await prisma.role.findUnique({ where: { name: 'Guest' } });
        if (!userRole) {
            userRole = await prisma.role.create({ data: { name: "Guest" } });
        }
        //let random = Math.floor(100000 + Math.random() * 900000);
        // Create user
        let random = 123456;
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                countryCode,
                phone: `${phone}`,
                status: 0,
                roleId: userRole.id,
                otp: random
            },
        });

        return NextResponse.json(
            { message: MESSAGES.USER_CREATED, email: newUser.email },
            { status: 201 }
        );
    } catch (error) {
        console.log('........', error)
        console.error("[USER_POST_ERROR]", error);
        return NextResponse.json(
            { error: MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}

