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

// GET – fetch all notifications
export async function GET(request) {
  if (!authenticate(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get("userId"));
  const id = Number(searchParams.get("id"));
  let notifications;
  try {
    if (userId)
      notifications = await prisma.notification.findMany({
        where: {
          recepient: {
            contains: userId,
          },
        },
      }, {
        orderBy: { createdAt: "desc" },
      });
    else if (id)
      notifications = await prisma.notification.update({
        where: { id: Number(id) },
        data: { readStatus: true }
      });
    return NextResponse.json(notifications);
  } catch (err) {
    return handleError(err);
  }
}

// POST – create new notification
export async function POST(request) {
  if (!authenticate(request)) return unauthorized();
  try {
    const body = await request.json();
    const notification = await prisma.notification.create({ data: body });
    return NextResponse.json(notification, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
