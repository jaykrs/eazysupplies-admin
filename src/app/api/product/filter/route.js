import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt, verifyRole } from '../../utils/jwt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let products;
    if (searchParams.get('tag')) {
         products = await prisma.product.findMany({
            where: {
                tag: {
                    contains: searchParams.get('tag'),
                }
            }
        });
    } else if (searchParams.get('brand')) {
         products = await prisma.product.findMany({
            where: {
                brand: {
                    contains: searchParams.get('brand'),
                }
            }
        });
    } else if (searchParams.get('category')) {
         products = await prisma.product.findMany({
            where: {
                category: {
                    contains: searchParams.get('category'),
                }
            }
        });
    }else{
        products = {};
    }

   return NextResponse.json({data: products}, {status: 200});
}