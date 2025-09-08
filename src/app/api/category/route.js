import category from './category.json'
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
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
  let res = await prisma.category.findMany({});
    return NextResponse.json({data: res}, {status: 200});
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
      ImagePath,
      BannerPath,
      Description
    } = body

    const category = await prisma.category.create({
      data: {
        name,
        ImagePath,
        BannerPath,
        Description
      }
    })

    return NextResponse.json({ message: 'Category created successfully', category }, {status:201})
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ message: 'Internal server error', error }, {status: 500})
  }
}

export async function PUT(request) {

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('categoryId'));
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
      ImagePath,
      BannerPath,
      Description
    } = body

    const category = await prisma.category.findUnique({
      where: {
        id: id
      }
    })
    if (!category) {
      return NextResponse.json({ error: 'Category does not exist' }, { status: 404 });
    }
    const newCategory = await prisma.category.update({
      data: {
        name,
        ImagePath,
        BannerPath,
        Description
      },
      where: {
        id: id
      }
    });
    return NextResponse.json({ message: 'Category updated', newCategory }, { status: 200 });
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ message: 'Internal server error', error }, {status: 500})
  }
}
