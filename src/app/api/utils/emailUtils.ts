import { PrismaClient } from '@prisma/client';
import Mailjet from 'node-mailjet';
 import axios from 'axios';
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
          From: { Email: from, Name: 'Earthling Support' },
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

export async function sendWhatsAppOTP(receivername: string,receiverphone: string, otp: string) {

let data = JSON.stringify({
  "recipient": {
    "name": receivername,
    "to": receiverphone
  },
  "whatsapp": {
    "type": "template",
    "template": {
      "name": "otp",
      "components": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": '"'+otp+'"'
            }
          ]
        },
        {
          "type": "button",
          "sub_type": "url",
          "index": "0",
          "parameters": [
            {
              "type": "text",
              "text": '"'+otp+'"'
            }
          ]
        }
      ]
    }
  }
});
console.log(data);
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: process.env.META_URL,
  headers: { 
    'x-api-key': process.env.META_X_API_KEY, 
    'x-api-secret': process.env.META_X_API_SECRET, 
    'Content-Type': 'application/json'
  },
  data : data
};
console.log(config);
axios.request(config)
.then((response) => {
  console.log(response);
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}
