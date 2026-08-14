import puppeteer from 'puppeteer';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateInvoicePdf(orderid,data) {
console.log(orderid);
console.log(data);
    try {

    const subtotal = data.items.reduce((acc, item) => acc + (item.sellingPrice), 0);
    const totalTax = data.items.reduce((acc, item) => acc + (item.taxamt || 0), 0);
    const grandTotal = subtotal + totalTax;
    console.log("****************************");
    console.log(data);
    console.log(subtotal);
    console.log(totalTax);
    console.log(grandTotal);
   
// 1. Define your HTML (Same template as before)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          :root { --primary: #2563eb; --dark: #1e293b; --light-gray: #f8fafc; --border: #e2e8f0; --text-main: #334155; --text-muted: #64748b; }
          body { font-family: 'Helvetica', Arial, sans-serif; color: var(--text-main); margin: 0; padding: 0; }
          .invoice-container { max-width: 850px; margin: auto; padding: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 50px; }
          .logo-placeholder { width: 50px; height: 50px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; }
          .company-info h1 { margin: 0; font-size: 24px; color: var(--dark); }
          .company-info p { margin: 2px 0; font-size: 13px; color: var(--text-muted); }
          .invoice-meta { text-align: right; }
          .invoice-meta h2 { margin: 0; font-size: 30px; color: var(--primary); }
          .details-row { display: flex; justify-content: space-between; margin-bottom: 40px; padding: 20px; background-color: var(--light-gray); border-radius: 8px; }
          .detail-block h4 { margin: 0 0 8px 0; text-transform: uppercase; font-size: 11px; color: var(--primary); letter-spacing: 1px; }
          .detail-block p { margin: 0; font-size: 14px; font-weight: 500; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background-color: var(--dark); color: white; text-align: left; padding: 12px; font-size: 12px; }
          td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 14px; }
          .text-right { text-align: right; }
          .summary-container { display: flex; justify-content: flex-end; }
          .summary-table { width: 200px; }
          .summary-line { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
          .summary-total { border-top: 2px solid var(--primary); margin-top: 10px; padding-top: 10px; font-size: 16px; font-weight: 700; color: var(--primary); }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid var(--border); }
          .bank-info { font-size: 12px; padding: 15px; border: 1px dashed var(--border); border-radius: 8px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-info">
              <div class="logo-placeholder">${company.name.charAt(0)}</div>
              <h1>${data.company.name}</h1>
              <p>${data.company.address}</p>
              <p>${data.company.email}</p>
            </div>
            <div class="invoice-meta">
              <h2>INVOICE</h2>
              <p>#${orderid}</p>
              <p style="color: var(--text-muted); font-weight: normal;">Date: ${data.orderDate}</p>
            </div>
          </div>

          <div class="details-row">
            <div class="detail-block">
              <h4>Billed To</h4>
              <p>${data.customer.name}</p>
              <div style="color: var(--text-muted); font-size: 13px;">
                ${data.customer.phone}<br>${data.customer.address}
              </div>
            </div>
            <div class="detail-block" style="text-align: right;">
              <h4>Payment Due</h4>
              <p style="color: #e11d48;">${data.dueDate}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Qty X Price</th>
                <th class="text-right">Discount %</th>
                <th class="text-right">Discount Amt</th>
                <th class="text-right">Tax</th>
                <th class="text-right">Sell Price</th>
                <th class="text-right">Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${item.price.toFixed(2)}</td>
                  <td class="text-right">$${(item.count * item.price).toFixed(2)}</td>
                  <td class="text-right">$${item.discountPercentage(2)}</td>
                  <td class="text-right">$${item._discountAmount(2)}</td>
                  <td class="text-right">$${item.taxamt(2)}</td>
                  <td class="text-right">$${item.sellingPrice(2)}</td>
                  <td class="text-right">$${item.totalprice(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-container">
            <div class="summary-table">
              <div class="summary-line"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
              <div class="summary-line"><span>Tax</span><span>$${totalTax.toFixed(2)}</span></div>
              <div class="summary-line summary-total"><span>Total</span><span>$${grandTotal.toFixed(2)}</span></div>
            </div>
          </div>

          <div class="footer">
            <div class="bank-info">
              <strong>Bank Details:</strong><br>
              Bank: ${data.bankDetails.bankName} | A/C: ${data.bankDetails.accountNo}<br>
              IFC: ${data.bankDetails.ifc}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

         // Filename for PDF
        const filename = `performa-invoice${orderid}.pdf`;

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        // Generate PDF buffer
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: 20, bottom: 20, left: 10, right: 10 },
        });

        await browser.close();

        // Set folder path
        const folderPath = path.join(process.env.FILE_PATH, "/invoice");

        // Ensure folder exists
        fs.mkdirSync(folderPath, { recursive: true });

        // Full file path
        const filePath = path.join(folderPath, filename); 
        fs.writeFileSync(filePath, pdfBuffer); 
} catch(Error) {
        console.error(Error);
    }
}