import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isStorefrontRequest = ["status", "paginate", "ids", "search", "category_ids", "brand"]
    .some((key) => searchParams.has(key));

  const ids = searchParams.get("ids")
    ?.split(",")
    .map(Number)
    .filter(Number.isInteger);
  const categoryIds = searchParams.get("category_ids")
    ?.split(",")
    .map(Number)
    .filter(Number.isInteger);
  const brandIds = searchParams.get("brand_ids")
    ?.split(",")
    .map(Number)
    .filter(Number.isInteger);
  const search = searchParams.get("search")?.trim();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const perPage = Math.max(Number(searchParams.get("paginate")) || 25, 1);

  const where = {
    ...(searchParams.get("status") === "1" ? { status: true } : {}),
    ...(ids?.length ? { id: { in: ids } } : {}),
    ...(categoryIds?.length ? { categoryId: { in: categoryIds } } : {}),
    ...(brandIds?.length ? { brandId: { in: brandIds } } : {}),
    ...(search ? { name: { contains: search } } : {}),
  };
  const allowedSortFields = new Set(["name", "price", "stock", "createdAt", "updatedAt"]);
  const requestedField = searchParams.get("field");
  const sortField = allowedSortFields.has(requestedField) ? requestedField : "createdAt";
  const sortDirection = searchParams.get("sort") === "desc" ? "desc" : "asc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: { [sortField]: sortDirection },
      ...(isStorefrontRequest ? { skip: (page - 1) * perPage, take: perPage } : {}),
    }),
    prisma.product.count({ where }),
  ]);

  if (!isStorefrontRequest) return NextResponse.json(products);

  return NextResponse.json({
    current_page: page,
    last_page: Math.ceil(total / perPage),
    total,
    per_page: perPage,
    data: products,
  });
}

export async function POST(request) {
  try {
    if (await verifyAdmin(request)) {
      const body = await request.json();
      const res = await prisma.product.create({ data: body });
      return NextResponse.json({ data: res}, { status: 201 });
    }
  } catch (Error) {
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    if (await verifyAdmin(request)) {
      const body = await request.json();
      const { id, ...rest } = body;
      let prod = await prisma.product.update({ where: { id }, data: rest });
      return NextResponse.json(prod);
    }
  } catch (Error) {
    console.log(Error);
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}
