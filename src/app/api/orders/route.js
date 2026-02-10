import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin, authenticate } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";
import { generateOrderSummaryHTML, generateApprovedOrderSummaryHTML, sendEmail, sendWhatsAppOrderCreate } from "../utils/emailUtils";
import { createNotification } from "../utils/emailUtils";

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
    const { items, shipping, payment, jsonData } = body;
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
    }
    if (!payload.userId || !items?.length) {
      return NextResponse.json(
        { error: "userId and at least one item are required" },
        { status: 400 }
      );
    }

    // ✅ Check if user exists
    const _user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!_user) {
      return NextResponse.json(
        { error: `Invalid user` },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
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

    const itemsText = order.items
      .map((item) => {
        const lineTotal = item.price * item.quantity;
        return `${item.product.name} × ${item.quantity} = ₹${lineTotal.toFixed(2)}`;
      })
      .join('\n');

    const orderhtml = generateOrderSummaryHTML(order, payload.name);
    await sendEmail(payload.email, "Order Created with " + order.id, orderhtml);
    await sendWhatsAppOrderCreate(order?.user?.name, order?.user?.countryCode + order?.user?.phone, order.id, "Status : Created", itemsText);
    await createNotification("Order Created with " + order.id, payload.userId.toString(), orderhtml);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.log("POST /orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status, approved = false } = body;
    if (verifyAdmin(request)) {
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

        let result = await prisma.order.update({ where: { id }, data: { status, approved } });
        const notification = await prisma.notification.create({
          data: {
            name: 'Order ' + id + ' approved',
            type: "notification",
            remarks: "Order Number " + id + " approved by Admin, Please proceed for payment",
            recepient: orders?.userId.toString()
          }
        });
        //return NextResponse.json(result);
        // return NextResponse.json({ offer, Products, filterProduct });
        const itemsTextapproved = orders.items
          .map((item) => {
            return `${item.product.name} X ${item.quantity}`;
          })
          .join('\n');
        const orderhtml = generateApprovedOrderSummaryHTML(orders, Number(orders.userId), orders?.user?.name);
        await sendEmail(orders?.user?.email, "Order Approved with " + result.id, orderhtml);
        await createNotification("Order Approved with " + orders.id, orders?.userId?.toString(), orderhtml);
        await sendWhatsAppOrderCreate(orders?.user?.name, orders?.user?.countryCode + orders?.user?.phone, orders.id, "Status : Approved", itemsTextapproved);

        return NextResponse.json("approved");
      } else if (status == "REJECTED") {
        const order = await prisma.order.findUnique({ where: { id: id } });
        if (!order) {
          return NextResponse.json({ msg: "Order details not found!" }, { status: 404 });
        }
        let update = await prisma.order.update({ where: { id: id }, data:{ status : status} });
        return NextResponse.json({msg: "Rejected"}, { status: 200 });
      } else {
       return NextResponse.json({ msg: "Invalid method!" });
      }
    }
  } catch (Error) {
    console.log(Error);
    return NextResponse.json(
      { error: MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}
