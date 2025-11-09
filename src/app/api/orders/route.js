import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "../utils/jwt";

const prisma = new PrismaClient();

// 📌 GET /api/orders?page=1&limit=10&sortBy=createdAt&order=desc&status=PENDING
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          user: true,
          items: { include: { product: true } },
          shipping: true,
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error("GET /orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// 📌 POST /api/orders
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items, shipping, payment, jsonData } = body;

    if (!userId || !items?.length) {
      return NextResponse.json(
        { error: "userId and at least one item are required" },
        { status: 400 }
      );
    }

    // ✅ Check if user exists
    const _user = await prisma.user.findUnique({ where: { id: userId } });
    if (!_user) {
      return NextResponse.json(
        { error: `User with ID ${userId} does not exist` },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId,
        jsonData,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            backlogquantity: item.backlogquantity || 0,
            price: item.price,
          })),
        },
        shipping: shipping ? { create: shipping } : undefined,
        payment: payment ? { create: payment } : undefined,
      },
      include: {
        user: true,
        items: { include: { product: true } },
        shipping: true,
        payment: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (verifyAdmin(request)) {
      const body = await request.json();
      const { id, status, approved = false } = body;

      if (approved) {
        let filterProduct, offer, jsonData = [], jsonFound = false;
        let orders = await prisma.order.findUnique({
          where: {
            id: id,
          },
          include: {
            user: true,
            items: {
              include: {
                product: true, // 👈 this includes product details inside each item
              },
            },
            shipping: true,
            payment: true,
          },
        });
        const Products = await prisma.product.findMany();
        for (const el of orders.items) {
          const offer = await prisma.offers.findMany({
            where: {
              userId: { contains: orders?.user?.id?.toString() },
              categoryId: { contains: el.product?.categoryId?.toString() }
            }
          });

          if (offer.length === 0) continue; // skip if no offer

          const filterProduct = Products.filter(
            (p) => Number(el.product?.id) === p.id
          );

          if (filterProduct.length === 0) continue;
          let product = filterProduct[0];
          let price = Number(product.price);
          let discount = offer[0]?.discount || 0;

          // always start with an array
          let jsonData = Array.isArray(product.jsonData)
            ? [...product.jsonData]
            : [];

          // try to find existing entry
          let found = false;

          jsonData = jsonData.map((entry) => {
            if (
              entry.orderId === orders.id &&
              entry.userId === orders.user?.id &&
              entry.categoryId === el.product?.categoryId
            ) {
              found = true;
              const discountAmount = (price * discount) / 100;
              return {
                ...entry,
                discountPercentage: discount,
                discountAmount,
                sellingPrice: price - discountAmount
              };
            }
            return entry;
          });

          // if not found, add a new one
          if (!found) {
            const discountAmount = (price * discount) / 100;
            jsonData.push({
              orderId: orders.id,
              userId: orders.user?.id,
              categoryId: el.product?.categoryId,
              discountPercentage: discount,
              discountAmount,
              sellingPrice: price - discountAmount
            });
          }

          await prisma.product.update({
            where: { id: product.id },
            data: { jsonData }
          });
        }

        let result = await prisma.order.update({ where: { id }, data: { status, approved } })
        return NextResponse.json(result);
        // return NextResponse.json({ offer, Products, filterProduct });
      }

      // if(approved === 'true' && applydiscount === 'true') {

      //   let jsonData;
      //   let productListJson;
      //   let finalProductListJson;
      //   let orderTotalPrice;
      //   let orderDiscount;
      //   let orderFinalPrice;
      //   steps 1 - > read ProductList
      //   step 2 - > iterateproductlist
      //   step 3 - > else if (userId && categoryId) {
      //         offers = await prisma.offers.findUnique({ where: { userId: Number(userId), categoryId: Number(categoryId) } });
      //     }
      //   step 4 - >  product model extend orderProduct (discount % , discount amt, sellprice)
      //   finalProductListJson.push(orderProduct)
      // }

      // return NextResponse.json(await prisma.order.update({ where: { id }, data: { status, approved } }));
      return NextResponse.json('updated');
    }
  } catch (Error) {
    console.log(Error);
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}
