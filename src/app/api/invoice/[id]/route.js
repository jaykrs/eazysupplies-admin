import { NextResponse } from 'next/server';
import { authenticate, verifyAdmin, getUserId, handleHtmlToPdf,handleHtmlFromOrder } from "../../utils/jwt"; // adjust import path if needed

export async function GET(request , { params }) {
  
    try {
     const id = (await params).id;

    // 1. Fetch your order data from your DB (MySQL/Prisma/etc.)
    // const orderData = await db.order.findUnique({ where: { id } });
    
    // For this example, we assume orderData and products are already fetched
    
   const { html, userId } = await handleHtmlFromOrder(Number(id));
   console.log(html);
    // 5. Return the HTML with the correct Content-Type
    return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
      })

  } catch (error) {
    console.error("Invoice API Error:", error);
    return NextResponse.json({ error: "Failed to render invoice" }, { status: 500 });
  }
}