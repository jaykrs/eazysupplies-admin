import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let products;
    try {
    if (searchParams.get('tag')) {
         products = await prisma.product.findMany({
            where: {
                tags: {
                    contains: searchParams.get('tag'),
                }
            }
        });
        return NextResponse.json({data: products}, {status: 200});
    } else if (searchParams.get('brand')) {
    const brand = await prisma.brand.findUnique({
            where: { id: Number(searchParams.get('brand')) }, 
            include: {
                products: true,
            },
        });
    return NextResponse.json(brand);    
    } else if (searchParams.get('category')) {
       const category = await prisma.category.findUnique({
            where: { id: Number(searchParams.get('category')) }, 
            include: {
                products: true,
            },
        });
    return NextResponse.json(category);
    }else{
        products = {};
    }
    } catch(Error) {console.log(Error);}
   
}