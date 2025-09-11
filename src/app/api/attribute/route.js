import attribute from "./attribute.json";
import { NextResponse } from "next/server";
import { verifyJwt, verifyRole, parseAuthCookie } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let res = await prisma.attribute.findMany({});
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
      style,
      slug,
      status = 1,
      attribute_values = []
    } = body;

    // Check for existing slug
    const exists = await prisma.attribute.findUnique({ where: { slug } });
    if (exists) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    console.log('........', payload);
    const attribute = await prisma.attribute.create({
      data: {
        name,
        style,
        slug,
        status,
        created_by_id: String(payload.userId),
        attribute_values: {
          create: attribute_values.map(value => ({
            value: value.value,
            slug: value.slug,
            hex_color: value.hex_color,
            created_by_id: String(payload.userId)
          }))
        }
      },
      include: {
        attribute_values: true
      }
    });

    return NextResponse.json(
      { message: 'Attribute created successfully', attribute },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating attribute:', error);
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const attributeId = Number(searchParams.get('attributeId'));
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
      style,
      slug,
      status = 1,
      attribute_values = []
    } = body;

    // Check if attribute exists
    const existing = await prisma.attribute.findUnique({
      where: { id: attributeId },
      include: { attribute_values: true }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }

    // If slug changed, check uniqueness
    if (slug !== existing.slug) {
      const slugExists = await prisma.attribute.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
    }

    // Delete old attribute values (sub-attributes)
    await prisma.attributeValue.deleteMany({
      where: { attribute_id: attributeId }
    });

    // Update attribute with new data + recreate sub-attributes
    const updated = await prisma.attribute.update({
      where: { id: attributeId },
      data: {
        name,
        style,
        slug,
        status,
        created_by_id: String(payload.userId),
        attribute_values: {
          create: attribute_values.map(value => ({
            value: value.value,
            slug: value.slug,
            hex_color: value.hex_color,
            created_by_id: String(payload.userId)
          }))
        }
      },
      include: {
        attribute_values: true
      }
    });

    return NextResponse.json({ message: 'Attribute updated successfully', attribute: updated }, { status: 200 });

  } catch (error) {
    console.error('Error updating attribute:', error);
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 }
    );
  }
}


