import { NextResponse } from "next/server";
import { authenticate, generateTransactionId, decryptData } from "@/app/api/utils/jwt";
import { MESSAGES } from "@/app/api/utils/statusConstant";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });
    }
    const orderId = Number(body.orderId);
    const amount = Number(body.amount);
    const method = Array.isArray(body.method) ? body.method[0] : body.method;
    if (!Number.isInteger(orderId) || !Number.isFinite(amount) || amount <= 0 || !["NB", "OFF"].includes(method)) {
      return NextResponse.json({ error: "Invalid payment request" }, { status: 400 });
    }
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: Number(payload.userId) },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const approvedTotal = Array.isArray(order.jsonOrderData)
      ? order.jsonOrderData.reduce((sum, item) => sum + Number(item?.totalPrice || 0), 0)
      : 0;
    const orderAmount = approvedTotal > 0
      ? approvedTotal
      : order.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    if (!Number.isFinite(orderAmount) || orderAmount <= 0 || Math.abs(amount - orderAmount) > 0.01) {
      return NextResponse.json({ error: "Payment amount does not match the order total" }, { status: 400 });
    }
    if (method === "OFF") {
      const payment = await prisma.payment.upsert({
        where: { orderId },
        create: {
          method,
          transectionid: `offline-${orderId}`,
          amount: orderAmount,
          orderId,
          userId: Number(payload.userId),
          status: "PENDING",
        },
        update: {
          method,
          transectionid: `offline-${orderId}`,
          amount: orderAmount,
          status: "PENDING",
        },
      });
      return NextResponse.json({ offline: true, payment, realTimePaymentData: { message: "" } });
    }
    //OAuth Token
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.ClientId);
    params.append("client_secret", process.env.ClinetSecretId);

    const transactionid = await generateTransactionId();
    console.log(transactionid);
    const userData = await prisma.user.findUnique({ where: { id: payload.userId } });
    const authResponse = await fetch(process.env.AuthUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: AbortSignal.timeout(15000),
    });

    const authData = await authResponse.json();
  console.log(authResponse);
    if (!authResponse.ok) {
      return NextResponse.json(authData, { status: authResponse.status });
    }
    const pay = {
      requestorTransactionId: transactionid,
      debtorName: userData.name,
      debtorEmailId: userData.email,
      debtorMobileNumber: userData.phone ? "+91-" + userData.phone.slice(0, 10) : "",
      debtorWhatsAppNumber: userData.phone ? "+91-" + userData.phone.slice(0, 10) : "",
      collectionReferenceNumber: orderId,
      reasonForCollection: body.reasonForCollection || '',
      initialDueAmount: orderAmount,
      initialDueDate: body.initialDueDate || "",
      finalDueAmount: orderAmount,
      collectionAmountCurrency: "INR",
      payVia: [method],
      returnUrl: process.env.ReturnUrl
    };
    console.log(pay);
    // Encrypt Request
    const payBody = {
      requestToPay: JSON.stringify(pay),
      encKey: process.env.EncryptionKey
    };

    const encryptResponse = await fetch(process.env.EncryptionURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": process.env.X_apiKey
      },
      body: JSON.stringify(payBody),
      signal: AbortSignal.timeout(15000),
    });

    const encryptedData = await encryptResponse.text();

    if (!encryptResponse.ok) {
      return NextResponse.json(encryptedData, {
        status: encryptResponse.status
      });
    }

    // Real Time Payment

    const realTimePaymentResponse = await fetch(process.env.realTimeRequestToPay, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": process.env.X_apiKey,
        "Authorization": "Bearer " + authData.access_token
      },
      body: JSON.stringify({
        "encryptedData": encryptedData
      }),
      signal: AbortSignal.timeout(20000),
    });

    const realTimePaymentData = await realTimePaymentResponse.json();
    if (!realTimePaymentResponse.ok) {
      return NextResponse.json({ error: realTimePaymentData?.message || "Payment gateway request failed" }, { status: realTimePaymentResponse.status });
    }
    let payment = await prisma.payment.findUnique({ where: { orderId: Number(body.orderId) } });
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          method,
          transectionid: transactionid.toString(),
          amount: orderAmount,
          orderId,
          userId: payload.userId
        }
      });
    } else {
      payment = await prisma.payment.update({
        data: {
          method,
          transectionid: transactionid.toString(),
          amount: orderAmount,
        }, where:{id: payment.id}
      });
    }

    return NextResponse.json({realTimePaymentData, payment});
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
