import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";
const prisma = new PrismaClient();

// export async function GET() {
//   const res =  await prisma.product.findMany({
//     include: { category: true, brand: true }  // tags: { include: { tag: true } }tags: { include: { tag: true } }
//   })
//   return NextResponse.json(res);
// }

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("productId"));
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true, brand: true },
      });
      return NextResponse.json({ data: product || [] }, { status: 200 });
    }

    const parseIds = (value) => value?.split(",").map(Number).filter(Number.isInteger);
    const ids = parseIds(searchParams.get("ids"));
    const categoryIds = parseIds(searchParams.get("category_ids")) ||
      (Number(searchParams.get("categoryId")) ? [Number(searchParams.get("categoryId"))] : undefined);
    const brandIds = parseIds(searchParams.get("brand_ids")) ||
      (Number(searchParams.get("brandId")) ? [Number(searchParams.get("brandId"))] : undefined);
    const search = searchParams.get("search")?.trim();
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const perPage = Math.min(Math.max(Number(searchParams.get("paginate")) || 25, 1), 100);
    const storefrontKeys = ["status", "paginate", "ids", "search", "category_ids", "brand_ids", "field", "sort"];
    const isStorefrontRequest = storefrontKeys.some((key) => searchParams.has(key));
    const allowedSortFields = new Set(["name", "price", "stock", "createdAt", "updatedAt"]);
    const requestedField = searchParams.get("field");
    const sortField = allowedSortFields.has(requestedField) ? requestedField : "createdAt";
    const sortDirection = searchParams.get("sort") === "desc" ? "desc" : "asc";

    const where = {
      ...(searchParams.get("status") === "1" || ids?.length ? { status: true } : {}),
      ...(ids?.length ? { id: { in: ids } } : {}),
      ...(categoryIds?.length ? { categoryId: { in: categoryIds } } : {}),
      ...(brandIds?.length ? { brandId: { in: brandIds } } : {}),
      ...(search ? { name: { contains: search } } : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true },
        orderBy: { [sortField]: sortDirection },
        ...(isStorefrontRequest ? { skip: (page - 1) * perPage, take: perPage } : {}),
      }),
      prisma.product.count({ where }),
    ]);
    const tax = await prisma.tax.findMany();

    const allSupplierIds = products
      .map((p) => p.supplier)            // get comma-separated string
      .filter(Boolean)                   // remove null or empty
      .flatMap((supStr) => supStr.split(',')) // split string to array
      .map((id) => Number(id))           // convert to number (adjust if string)
      .filter((id) => !isNaN(id));       // filter invalid

    // Remove duplicates
    const uniqueSupplierIds = [...new Set(allSupplierIds)];

    // 3. Fetch suppliers
    const suppliers = await prisma.supplier.findMany({
      where: { id: { in: uniqueSupplierIds } },
    });

    // 4. Create a lookup map for suppliers by ID
    const supplierMap = suppliers.reduce((acc, supplier) => {
      acc[supplier.id] = supplier;
      return acc;
    }, {});

    // 5. Attach suppliers details to each product
    const productsWithSuppliers = products.map((product) => {
      const supplierIds = product.supplier
        ? product.supplier.split(',').map((id) => Number(id))
        : [];

      return {
        ...product,
        suppliers: supplierIds.map((id) => supplierMap[id]).filter(Boolean),
      };
    });

    if (!isStorefrontRequest) {
      return NextResponse.json({ data: productsWithSuppliers, tax }, { status: 200 });
    }

    return NextResponse.json({
      current_page: page,
      last_page: Math.ceil(total / perPage),
      total,
      per_page: perPage,
      data: productsWithSuppliers,
    });
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    let payload = await authenticate(request);
    if (await verifyAdmin(request)) {
      const body = await request.json();
      body.createdBy = Number(payload?.userId);
      const res = await prisma.product.create({ data: body });
      return NextResponse.json({ data: res }, { status: 201 });
    }
  } catch (Error) {
    console.log('..........Error', Error);
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
