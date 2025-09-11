
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import { parseAuthCookie, verifyJwt, verifyRole } from "../utils/jwt";

const prisma = new PrismaClient()

const MESSAGES = {
  REQUIRED_FIELDS: "Email and password are required",
  USER_NOT_FOUND: "User does not exist",
  USER_INACTIVE: "User is not active",
  INVALID_PASSWORD: "Incorrect password",
  LOGIN_SUCCESS: "Login successful",
  SERVER_ERROR: "Internal server error",
  USER_ACTIVATED: "User Activated",
  USER_ACTIVATION_FAILED: "Email or Otp is not correct",
  USER_ROLE_NOT_ADMIN: "Unauthorized to login, please contact admin!"
};

export async function GET() {
  let res = await prisma.tag.findMany({});
  return NextResponse.json({ data: res }, { status: 200 });
}

export async function POST(request) {

  try {
    const body = await request.json();
    const token = parseAuthCookie(request.headers.get('cookie'));
    const payload = token ? verifyJwt(token) : null;
    if (!payload || (await verifyRole(payload.userId)).toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin role required' },
        { status: 403 }
      );
    }
    const {
      name,
      slug,
      type,
      description,
      status
    } = body;
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        type,
        description,
        status
      }
    })

    return NextResponse.json({ message: 'tag created successfully', tag }, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}

export async function PUT(request) {

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('tagId'));
    const token = parseAuthCookie(request.headers.get('cookie'));
    const payload = token ? verifyJwt(token) : null;
    if (!payload || (await verifyRole(payload.userId)).toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin role required' },
        { status: 403 }
      );
    }
    const {
      name,
      type,
      description,
      status
    } = body

    const tag = await prisma.tag.findUnique({
      where: {
        id: id
      }
    })
    if (!tag) {
      return NextResponse.json({ error: 'Tag does not exist' }, { status: 404 });
    }
    const newTag = await prisma.tag.update({
      data: {
        name,
        type,
        description,
        status
      },
      where: {
        id: id
      }
    });
    return NextResponse.json({ message: 'tag updated', newTag }, { status: 200 });
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
