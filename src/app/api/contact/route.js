import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/emailUtils";

const prisma = new PrismaClient();
const escapeHtml = (value) => String(value || "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (name.length < 2 || name.length > 100 || subject.length < 2 || subject.length > 180 || message.length < 2 || message.length > 5000) {
      return NextResponse.json({ error: "Please provide valid contact details." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Please provide a valid email and 10-digit Indian phone number." }, { status: 400 });
    }

    const admins = await prisma.user.findMany({
      where: { role: { name: "admin" }, status: true, deleted: false },
      select: { id: true },
    });
    const contactData = { name, email, phone, subject, message };
    const recipients = admins.length ? admins.map((admin) => String(admin.id)) : ["admin"];
    await prisma.notification.createMany({
      data: recipients.map((recipient) => ({
        name: `Contact enquiry: ${subject}`,
        type: "Contact Inquiry",
        recepient: recipient,
        remarks: `${name} (${email}, ${phone}): ${message}`,
        data: contactData,
      })),
    });

    const html = `<h2>New website contact enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong><br>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`;
    void sendEmail(process.env.SUPPORT_EMAIL || "info@eazysupplies.com", `Website enquiry: ${subject}`, html);

    return NextResponse.json({ success: true, message: "Your enquiry has been submitted." }, { status: 201 });
  } catch (error) {
    console.error("POST /contact error:", error);
    return NextResponse.json({ error: "Unable to submit your enquiry." }, { status: 500 });
  }
}
