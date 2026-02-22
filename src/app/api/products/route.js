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
    const id = Number(searchParams.get('productId'));
    const ids = searchParams.get('ids');
    const catId = Number(searchParams.get('categoryId'));
    const barId = Number(searchParams.get('brandId'));
    let res;
    if (id) {
      const res = await prisma.product.findUnique({
        where: {
          status : true,
          id: id
        },
        include: { category: true, brand: true }
      })
      return NextResponse.json({ data: res ? res : [] }, { status: 200 });
    }

    if (ids) {
      const arr = ids.split(",").map(Number);
      const res = await prisma.product.findMany({
        where: {
          status : true,
          id: {
            in : arr
          }
        },
        include: { category: true, brand: true }
      })
      return NextResponse.json({ data: res ? res : [] }, { status: 200 });
    }

    const products = catId ? await prisma.product.findMany({
      include: { category: true, brand: true }, where: { status: true, categoryId: catId }
    }) : barId ? await prisma.product.findMany({
      include: { category: true, brand: true }, where: { status: true , brandId: barId }
    }) : await prisma.product.findMany({
      include: { category: true, brand: true }
    });
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

    return NextResponse.json({ data: productsWithSuppliers, tax }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    let payload = await authenticate(request);
    if (verifyAdmin(request)) {
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
    if (verifyAdmin(request)) {
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
