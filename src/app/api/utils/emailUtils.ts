import { PrismaClient } from '@prisma/client';
import Mailjet from 'node-mailjet';

const prisma = new PrismaClient();

export async function sendEmail(recepient: string, subject: string, body: string) {
const apiKey = process.env.MAILJET_API_KEY;
const apiSecret = process.env.MAILJET_API_SECRET;
const from = process.env.MAIL_FROM;

  try {
    const mailjet = Mailjet.apiConnect(apiKey, apiSecret);

    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: { Email: from, Name: 'Jayant admin' },
          To: [{ Email: recepient }],
          Subject: subject,
          TextPart: body || '',
          HTMLPart: body || ''
        }
      ]
    });
    console.error(result);
} catch (err) {
    console.error(err);
}
}

export function sendSms(recepient: string, subject: string, body: string) {

}
/**
 * Creates a basic notification entry.
 * @param {Object} params - Notification details.
 * @param {string} params.name - Name of the notification.
 * @param {string} params.recepient - Recipient identifier (email/phone/userId).
 * @param {string} [params.remarks] - Optional remarks or message.
 * @returns {Promise<Object>} Created notification record.
 */
export async function createNotification( name : string, recepient : string, remarks = "" ): Promise<object> {
  console.log(name , recepient , remarks);
  try {
    if (!name || !recepient) {
      throw new Error("Both 'name' and 'recepient' are required.");
    }

    const notification = await prisma["notification"].create({
      data: {
        name,
        recepient,
        remarks,
      },
    });

    return notification;
  } catch (error) {
    console.error("[NOTIFICATION_CREATE_ERROR]", error);
    throw new Error("Failed to create notification.");
  }
}
// utils/sendMessage.ts

export async function sendWhatsApp(receiver: string, mtype: string, text: string) {
  const apiKey = "28784ec98d3a2be2b31b0f08da853c35718c"; // ideally move this to env var
  const baseUrl = "https://demo.synbus.in/api/send-message";

  const url = new URL(baseUrl);
  url.searchParams.append("apikey", apiKey);
  url.searchParams.append("receiver", receiver);
  url.searchParams.append("mtype", mtype);
  url.searchParams.append("text", text);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // optional to prevent caching
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
