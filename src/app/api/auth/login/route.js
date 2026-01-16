import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { sendWhatsAppOTP } from "../../utils/emailUtils";
 
const prisma = new PrismaClient();

/**
 * Centralized messages
 */
const MESSAGES = {
  REQUIRED_FIELDS: "Email | gstn | phone and password are required",
  USER_NOT_FOUND: "User does not exist",
  USER_INACTIVE: "User is not active",
  INVALID_PASSWORD: "Incorrect password",
  MISSING_CRED:"Password or OTP Required",
  INVALID_OTP: "Incorrect OTP",
  GENERATE_OTP: "OTP SENT",
  LOGIN_SUCCESS: "Login successful",
  SERVER_ERROR: "Internal server error",
  USER_ACTIVATED: "User Activated",
  USER_UPDATED: "User Updated",
  USER_NOT_UPDATED: "User Update Failed",
  USER_ACTIVATION_FAILED: "Email or Otp is not correct"
};

/**
 * POST handler - login user
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, gstn, phone, otp } = body;
    let flag = false;
    // Validate input
    if ((!password && !otp) || (!email && !phone && !gstn)) {
  return NextResponse.json(
    { error: MESSAGES.REQUIRED_FIELDS },
    { status: 400 }
  );
}

let user = null;

if (email) {
  user = await prisma.user.findUnique({ where: { email } });
} else if (phone) {
  user = await prisma.user.findFirst({ where: { phone } });
} else if (gstn) {
  user = await prisma.user.findFirst({ where: { gstn } });
}

if (!user) {
      return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 401 });
    }

    // Check user status
    if (!user.status) {
      return NextResponse.json({ error: MESSAGES.USER_INACTIVE }, { status: 401 });
    }

    if(!password && !otp)
      return NextResponse.json({ error: MESSAGES.MISSING_CRED }, { status: 401 });
    // Validate password
    const isloginValid = password ? await compare(password, user.password) : otp && otp == user.otp;
    if (!isloginValid) {
      return NextResponse.json({ error: MESSAGES.INVALID_PASSWORD }, { status: 401 });
    } 

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret", // fallback in dev
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "86400", 10) }
    );

    // Fetch role name

    // Response payload (safe fields only)
    const data = {
      email: user.email,
      userId: user.id,
      name: user.name
    };

    const response = NextResponse.json(
      { message: MESSAGES.LOGIN_SUCCESS, data },
      { status: 200 }
    );

    // Set JWT cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      //    secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN_SEC || "86400"), // fallback: 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const action = searchParams.get("action");
    const otp = Number(searchParams.get("otp"));
    const adminotp = searchParams.get("adminotp");
    //    let random = Math.floor(100000 + Math.random() * 900000);
    //Requires email as query param: /api/user?action=forgotPassword&email=test@example.com
    let random = 123456;
    if (action === "forgotPassword") {
      const email = searchParams.get("email");
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 404 });
      }
      // Generate a temporary token (simulate)
      await prisma.user.update({
        where: { id: parseInt(user.id) },
        data: { password: random },
      });
      // Here you would normally send email with token otp
      // For now, just return token in response
      return NextResponse.json({
        message: MESSAGES.FORGOT_PASSWORD_SENT,
        email: user.email,
      });
    }
    if (action === "generateotp") {
      const phone = searchParams.get("phone");
      if (!phone) {
        return NextResponse.json({ error: "phone is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 404 });
      }
      // Generate a temporary token (simulate)
     await sendWhatsAppOTP(user.name, user.countryCode+user.phone, user.otp);
      // Here you would normally send email with token otp
      // For now, just return token in response
      return NextResponse.json({
        message: MESSAGES.GENERATE_OTP,
        phone: user.phone,
      });
    }
    //Requires userId as query param: /api/user?action=activateUser&email=test@test.com&otp=134d
    if (action === "activateUser") {
      const email = searchParams.get("email");
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 404 });
      }

      if (user.status) {
        return NextResponse.json({ message: MESSAGES.USER_ALREADY_ACTIVE });
      }

      // Activate user
      if (otp > 0 && user.otp == otp) {
        await prisma.user.update({
          where: { id: parseInt(user.id) },
          data: { status: true },
        });
        return NextResponse.json({ message: MESSAGES.USER_ACTIVATED }, { status: 200 });
      }
      return NextResponse.json({ message: MESSAGES.USER_ACTIVATION_FAILED });
    }
    if (action === "makeAdmin") {
      const email = searchParams.get("email");
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 404 });
      }
      // Generate a temporary token (simulate)
      if (adminotp == process.env.ADMIN_OTP) {

        let userRole = await prisma.role.findUnique({ where: { name: 'admin' } });
        if (!userRole) {
          userRole = await prisma.role.create({ data: { name: "admin" } });
        }
        await prisma.user.update({
          where: { id: parseInt(user.id) },
          data: { roleId: userRole.id },
        });
        return NextResponse.json({
          message: MESSAGES.USER_UPDATED,
          email: user.email,
        });
      }
      // Here you would normally send email with token otp
      // For now, just return token in response
      return NextResponse.json({
        message: MESSAGES.USER_NOT_UPDATED,
        email: user.email,
      });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[USER_GET_ERROR]", error);
    console.log('............', error);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}