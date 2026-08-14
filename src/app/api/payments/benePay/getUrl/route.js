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
      debtorMobileNumber: "+91-" + userData.phone.slice(0, 10),
      debtorWhatsAppNumber: userData.phone ? "+91-" + userData.phone.slice(0, 10) : "",
      collectionReferenceNumber: body.orderId,
      reasonForCollection: body.reasonForCollection || '',
      initialDueAmount: body.amount,
      initialDueDate: body.initialDueDate || "",
      finalDueAmount: body.amount,
      collectionAmountCurrency: "INR",
      payVia: body.method,
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
      body: JSON.stringify(payBody)
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
      })
    });

    const realTimePaymentData = await realTimePaymentResponse.json();

    // if (!realTimePaymentData.ok) {
    //   return NextResponse.json(realTimePaymentData, {
    //     status: realTimePaymentData.status
    //   });
    // }
    let payment = await prisma.payment.findUnique({ where: { orderId: Number(body.orderId) } });
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          method: body.method[0],
          transectionid: transactionid.toString(),
          amount: body.amount,
          orderId: body.orderId,
          userId: payload.userId
        }
      });
    } else {
      payment = await prisma.payment.update({
        data: {
          method: body.method[0],
          transectionid: transactionid.toString(),
          amount: body.amount,
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

