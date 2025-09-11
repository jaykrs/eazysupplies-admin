
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
  let res = await prisma.brand.findMany({});
  return NextResponse.json({ data: res }, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const token = parseAuthCookie(request.headers.get('cookie'));
    const payload = token ? verifyJwt(token) : null;

    if (!payload || (await verifyRole(payload.userId)).toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const {
      name,
      slug,
      metaTitle,
      metaDescription,
      status = 1,
      brandImage,
      brandMetaImage,
      brandBanner
    } = body;

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        status,
        createdById: payload.userId,
        brandImage: brandImage || undefined,
        brandMetaImage: brandMetaImage || undefined,
        brandBanner: brandBanner || undefined
      }
    });

    return NextResponse.json({ message: 'Brand created successfully', brand }, { status: 201 });

  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

export async function PUT(request) {

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('brandId'));
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
      metaTitle,
      metaDescription,
      status = 1,
      brandImage,
      brandMetaImage,
      brandBanner
    } = body

    const brand = await prisma.brand.findUnique({
      where: {
        id: id
      }
    })
    if (!brand) {
      return NextResponse.json({ error: 'Brand does not exist' }, { status: 404 });
    }
    const newBrand = await prisma.brand.update({
      data: {
        name,
        metaTitle,
        metaDescription,
        status,
        brandImage,
        brandMetaImage,
        brandBanner
      },
      where: {
        id: id
      }
    });
    return NextResponse.json({ message: 'Brand updated', newBrand }, { status: 200 });
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
