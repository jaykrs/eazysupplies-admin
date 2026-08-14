import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../utils/emailUtils";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Centralized messages
 */
const MESSAGES = {
  REQUIRED_FIELDS: "Email and password are required",
  USER_NOT_FOUND: "User does not exist",
  PASSWORD_NOT_FOUND: "User Password does not exist",
  USER_INACTIVE: "User is deleted",
  USER_INACTIVE: "User is not active",
  INVALID_PASSWORD: "Incorrect password",
  LOGIN_SUCCESS: "Login successful",
  SERVER_ERROR: "Internal server error",
  USER_ACTIVATED: "User Activated",
  OTP_SENT: "OTP sent on email",
  USER_ACTIVATION_FAILED: "Email or Otp is not correct",
  USER_ROLE_NOT_ADMIN: "Unauthorized to login, please contact admin!",
  otpEmailTemplate : `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding: 20px 0; background-color: #007bff; color: #ffffff; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; text-align: center; }
        .otp { font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0; padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; display: inline-block; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; }
        .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello {{USER_NAME}},</p>
            <p>We received a request to reset your password. Use the OTP below to proceed:</p>
            <div class="otp">{{OTP}}</div>
            <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>If you have any questions, contact our support team.</p>
            <p>&copy; 2026 eazysupplies.com. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
};

/**
 * POST handler - login user
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: MESSAGES.REQUIRED_FIELDS },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 401 });
    }
    const role = await prisma.role.findUnique({ where: { id: user.roleId } });
    if (role.name.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: MESSAGES.USER_ROLE_NOT_ADMIN }, { status: 401 });
    }
    // Check user status
    if (!user.status) {
      return NextResponse.json({ error: MESSAGES.USER_INACTIVE }, { status: 401 });
    }

     // Check user status
    if (user.deleted) {
      return NextResponse.json({ error: MESSAGES.USER_DELETED }, { status: 401 });
    }
    // Validate password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: MESSAGES.INVALID_PASSWORD }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret", // fallback in dev
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "86400", 10) }
    );

    // Response payload (safe fields only)
    const data = {
      email: user.email,
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
    //    let random = Math.floor(100000 + Math.random() * 900000);
    //Requires email as query param: /api/user?action=forgotPassword&email=test@example.com
    let random = 123456;
    if (action === "forgotPassword") {
      const email = searchParams.get("email");
      const password = searchParams.get("password");
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 404 });
      }
       if (!password) {
        return NextResponse.json({ error: MESSAGES.PASSWORD_NOT_FOUND }, { status: 404 });
      }
       const hashedPassword = hashSync(password, 10);
      if(user.otp === otp) {
      // Generate a temporary token (simulate)
      await prisma.user.update({
        where: { id: parseInt(user.id) },
        data: { password: hashedPassword },
      });
    } else {
      return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
    }
      // Here you would normally send email with token otp
      // For now, just return token in response
      return NextResponse.json({
        message: MESSAGES.FORGOT_PASSWORD_SENT,
        email: user.email,
      });
    }
    if (action === "forgetpasswordotp") {
      const email = searchParams.get("email");
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: MESSAGES.USER_NOT_FOUND }, { status: 404 });
      }
       const randomotp = Math.floor(100000 + Math.random() * 900000);
        user = await prisma.user.update({
        where: { id: parseInt(user.id) },
        data: { otp: randomotp },
      });
      let htmlmsg = MESSAGES.otpEmailTemplate;
      htmlmsg = htmlmsg.replace('{{USER_NAME}}', user.name).replace('{{OTP}}',user.otp);
      await sendEmail(user.email, "Reset Password Request", htmlmsg);
      return NextResponse.json({ message: MESSAGES.OTP_SENT });
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

      if (user.status === 1) {
        return NextResponse.json({ message: MESSAGES.USER_ALREADY_ACTIVE });
      }

      // Activate user
      if (otp > 0 && user.otp == otp) {
        await prisma.user.update({
          where: { id: parseInt(user.id) },
          data: { status: 1 },
        });
        return NextResponse.json({ message: MESSAGES.USER_ACTIVATED }, { status: 200 });
      }
      return NextResponse.json({ message: MESSAGES.USER_ACTIVATION_FAILED });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[USER_GET_ERROR]", error);
    console.log('............', error);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}