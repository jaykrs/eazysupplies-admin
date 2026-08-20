import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const money = (value) => Number(value || 0).toFixed(2);
const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function generateInvoicePdf(orderId, data) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const discount = items.reduce((sum, item) => sum + Number(item.discountAmount || 0) * Number(item.quantity || 0), 0);
  const totalTax = items.reduce((sum, item) => sum + Number(item.taxAmount || 0) * Number(item.quantity || 0), 0);
  const grandTotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const company = data?.company || {};
  const customer = data?.customer || {};

  const htmlContent = `<!DOCTYPE html>
  <html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color:#334155; margin:0; font-size:12px; }
    .header { display:flex; justify-content:space-between; gap:24px; margin-bottom:28px; }
    .company h1, .invoice h2 { margin:0 0 6px; color:#1e293b; }
    .invoice { text-align:right; white-space:nowrap; }
    .details { display:flex; justify-content:space-between; gap:20px; padding:16px; background:#f8fafc; border-radius:8px; margin-bottom:24px; }
    table { width:100%; border-collapse:collapse; table-layout:fixed; }
    th { background:#1e293b; color:white; padding:9px 7px; text-align:left; font-size:10px; }
    td { padding:10px 7px; border-bottom:1px solid #e2e8f0; vertical-align:top; overflow-wrap:anywhere; }
    th:first-child, td:first-child { width:30%; }
    .num { text-align:right; }
    .summary { width:280px; margin:22px 0 0 auto; }
    .line { display:flex; justify-content:space-between; padding:5px 0; }
    .total { border-top:2px solid #2563eb; margin-top:6px; padding-top:10px; font-size:15px; font-weight:700; color:#2563eb; }
    .footer { margin-top:30px; padding-top:14px; border-top:1px solid #e2e8f0; color:#64748b; }
  </style></head><body>
    <div class="header">
      <div class="company"><h1>${escapeHtml(company.name)}</h1><div>${escapeHtml(company.address)}</div><div>${escapeHtml(company.email)}</div></div>
      <div class="invoice"><h2>PROFORMA INVOICE</h2><div>#${Number(orderId)}</div><div>Date: ${escapeHtml(data?.orderDate)}</div></div>
    </div>
    <div class="details">
      <div><strong>Billed To</strong><br>${escapeHtml(customer.name)}<br>${escapeHtml(customer.phone)}<br>${escapeHtml(customer.address)}</div>
      <div class="invoice"><strong>Payment Due</strong><br>${escapeHtml(data?.dueDate)}</div>
    </div>
    <table><thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Unit Price</th><th class="num">Discount</th><th class="num">Tax</th><th class="num">Line Total</th></tr></thead>
    <tbody>${items.map((item) => `<tr>
      <td><strong>${escapeHtml(item.name)}</strong></td>
      <td class="num">${Number(item.quantity || 0)}</td>
      <td class="num">₹${money(item.price)}</td>
      <td class="num">${money(item.discountPercentage)}%<br>₹${money(Number(item.discountAmount || 0) * Number(item.quantity || 0))}</td>
      <td class="num">${money(item.taxPercentage)}%<br>₹${money(Number(item.taxAmount || 0) * Number(item.quantity || 0))}</td>
      <td class="num">₹${money(item.totalPrice)}</td>
    </tr>`).join("")}</tbody></table>
    <div class="summary">
      <div class="line"><span>Subtotal</span><span>₹${money(subtotal)}</span></div>
      <div class="line"><span>Discount</span><span>-₹${money(discount)}</span></div>
      <div class="line"><span>Tax</span><span>₹${money(totalTax)}</span></div>
      <div class="line total"><span>Total</span><span>₹${money(grandTotal)}</span></div>
    </div>
    <div class="footer"><strong>Bank Details</strong><br>${escapeHtml(data?.bankDetails?.bankName)} · A/C ${escapeHtml(data?.bankDetails?.accountNo)} · IFSC ${escapeHtml(data?.bankDetails?.ifc)}</div>
  </body></html>`;

  const filename = `performa-invoice${Number(orderId)}.pdf`;
  const folderPath = path.join(process.env.FILE_PATH || path.join(process.cwd(), "public"), "invoice");
  const filePath = path.join(folderPath, filename);
  fs.mkdirSync(folderPath, { recursive: true });
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "A4", printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
  await prisma.order.update({ where: { id: Number(orderId) }, data: { invoicepath: filePath } });
  return filePath;
}
