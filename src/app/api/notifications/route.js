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
  const payload = await authenticate(request);
  if (!payload) return unauthorized();
  const { searchParams } = new URL(request.url);
  // const userId = Number(searchParams.get("userId"));
  const id = Number(searchParams.get("id"));
  let notifications;
  try {
    if (id) {
      notifications = await prisma.notification.update({
        where: { id: Number(id) },
        data: { readStatus: true }
      })
    }
    else if (payload?.userId) {
      notifications = await prisma.notification.findMany({
        where: {
          recepient: {
            contains: payload?.userId.toString(),
          },
        },
      }, {
        orderBy:[ { createdAt: "desc" }, {id: "desc"}],
      });
    }
    return NextResponse.json({ notifications });
  } catch (err) {
    console.log('err', err);
    return handleError(err);
  }
}

export async function PUT(request) {
  const payload = await authenticate(request);
  if (!payload) return unauthorized();
  try {
     const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if(!id){
      return NextResponse.json({msg:"Method not allowed!"}, {status: 404});
    }
    let notification = await prisma.notification.findUnique({where: {id: Number(id)}});
    if(!notification){
      return NextResponse.json({msg:"Data not found!"}, {status: 404});
    }
    notification = await prisma.notification.update({ where: {id: Number(id)}, data: {readStatus : true} });
    return NextResponse.json(notification, { status: 200 });
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
