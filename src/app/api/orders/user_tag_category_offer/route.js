import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        if (searchParams.get("tag_brand_category")) {
            const tag = await prisma.tag.findMany();
            const brand = await prisma.brand.findMany();
            const category = await prisma.category.findMany();
            const tax = await prisma.tax.findMany();
            const supplier = await prisma.supplier.findMany();
            return NextResponse.json({ tags: tag, brands: brand, categories: category, tax: tax, supplier: supplier }, { status: 200 });
        } else if (searchParams.get("user_tag_category")) {
            const tag = await prisma.tag.findMany();
            const category = await prisma.category.findMany();
            const user = await prisma.user.findMany();
            return NextResponse.json({ tags: tag, categories: category, user: user }, { status: 200 });
        }
        else {
            return NextResponse.json({ error: "filter is not allowed!" });
        }

    } catch (Error) {
        console.log("Error", Error);
        return NextResponse.json({ Error: "Internal server error" }, { status: 500 });
    }

}