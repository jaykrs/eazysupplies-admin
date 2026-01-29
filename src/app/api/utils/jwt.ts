import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { OrderEmailTemp } from '@/utils/constants';
import crypto from "crypto";
const prisma = new PrismaClient();

export function parseAuthCookie(cookie: string | null): string | null {
  if (!cookie) return null;
  const cookies = cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = decodeURIComponent(value);
    return prev;
  }, {} as Record<string, string>);

  return cookies['authToken'] || null;
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) //as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function authenticate(request) {
  const token = parseAuthCookie(request.headers.get("cookie"));
  return token ? verifyJwt(token) : null;
}

export async function getUserFromToken(request) {
  const payload = await authenticate(request);
  return payload && payload.userId ? payload : null;
}

export async function getUserId(request) {
  const payload = await getUserFromToken(request);
  return payload && payload.userId ? payload.userId : null;
}

export async function verifyAdmin(request) {
  try {
    const payload = await authenticate(request);
    const userRole = await verifyRole(payload.userId);
    return userRole == 'admin';
  } catch (error) {
    return null;
  }
}

export async function verifyRole(userId: number): Promise<string> {
  const user = await findUserById(userId);
  if (!user) return "";
  if (!user.status) return "";
  const roles = await prisma.role.findUnique({ where: { id: user.roleId } });

  return roles.name;
}
async function findUserById(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
}

export async function generateTransactionId(): Promise<string> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`
      INSERT INTO payment_txn_counter () VALUES ()
    `);

    const result = await tx.$queryRaw<
      { transaction_id: string }[]
    >`
      SELECT
        CONCAT(
          DATE_FORMAT(NOW(), '%Y%m%d'),
          LPAD(LAST_INSERT_ID(), 4, '0')
        ) AS transaction_id
    `;

    return "earthling" + result[0].transaction_id;
  });
}

function generateProductDiscount(product, ordId, taxData) {
  let jsonData = product.jsonData;
  let _dd = [];
  if (!jsonData) {
    _dd = [{ discountPercentage: 0, discountAmount: 0, taxId: 0, taxAmount: 0, taxpercent: 0, totalPrice: 0 }];
    let _taxId = Number(product?.tax);
    let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
    _taxpercent = _taxpercent[0].value;
    let _taxAmt = Number(product?.price) * Number(_taxpercent) / 100;
    _dd[0].taxAmount = _taxAmt;
    _dd[0].taxpercent = _taxpercent;
    _dd[0].totalPrice = Number(product?.price) + _taxAmt;
    return _dd[0];
  }
  else {
    _dd = jsonData.filter(el => el.orderId == ordId);
    if (_dd.length > 0) {
      let _taxId = Number(product?.tax);
      let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
      _taxpercent = _taxpercent[0].value;
      let _taxAmt = Number(_dd[0].sellingPrice) * Number(_taxpercent) / 100;
      _dd[0].taxAmount = _taxAmt;
      _dd[0].taxpercent = _taxpercent;
      _dd[0].totalPrice = Number(_dd[0].sellingPrice) + _taxAmt;
      return _dd[0];
    }
  }
}

function generateProductTotalPrice(order, taxData) {
  let total = 0;
  for (let data of order.items) {
    let jsonData = data.product.jsonData;
    if (!jsonData) {
      let _taxId = Number(data.product?.tax);
      let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
      _taxpercent = _taxpercent[0].value;
      let _taxAmt = Number(data.product?.price) * Number(_taxpercent) / 100;
      total += (Number(data.product?.price) + _taxAmt) * data.quantity;
    }
    else {
      let _dd = jsonData.filter(el => el.orderId == order.id);
      if (_dd.length > 0) {
        let _taxId = Number(data.product?.tax);
        let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
        _taxpercent = _taxpercent[0].value;
        let _taxAmt = Number(_dd[0].sellingPrice) * Number(_taxpercent) / 100;
        total += (Number(_dd[0].sellingPrice) + _taxAmt) * data.quantity;
      }
    }
  }
  return total;
}

export async function handleHtmlToPdf(id) {
  function generateProductRows(products, taxData) {
    return products.map(p => `
    <tr>
      <td>${p?.product?.name}</td>
      <td>${p?.quantity}</td>
      <td>₹${p?.product?.price.toFixed(2)}</td>
      <td>${generateProductDiscount(p.product, id, taxData)?.discountPercentage}</td>
      <td>${(Number(generateProductDiscount(p.product, id, taxData)?.discountAmount) * Number(p?.quantity)).toFixed(2)}</td>
      <td>${generateProductDiscount(p.product, id, taxData)?.taxpercent}</td>
      <td>${(Number(generateProductDiscount(p.product, id, taxData)?.taxAmount) * Number(p?.quantity)).toFixed(2)}</td>
      <td>${Number(generateProductDiscount(p.product, id, taxData)?.totalPrice * Number(p?.quantity)).toFixed(2)}</td>
    </tr>
  `).join("");
  }

  function formatDate(date?: Date | null) {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  const orderData = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shipping: true,
      payment: true,
      user: true
    },
  })
  const taxData = await prisma.tax.findMany();
  let OrderTemp = OrderEmailTemp;
  let shippingAdds = orderData?.shipping.address + ', ' + orderData?.shipping?.city + ', ' + orderData?.shipping?.country;
  let subTotal = 0, Total = 0, tax = 0;
  let total = generateProductTotalPrice(orderData, taxData);
  const productRows = generateProductRows(orderData?.items, taxData);
  const userId = orderData?.user?.id;
  OrderTemp = OrderTemp.replace('@Order', id);
  OrderTemp = OrderTemp.replace('@OrderStatus', orderData?.status || "PENDING");
  OrderTemp = OrderTemp.replace("@OrderDate",formatDate(orderData?.createdAt))
  OrderTemp = OrderTemp.replace('@ShippingAddress', shippingAdds);
  OrderTemp = OrderTemp.replace('@PaymentStatus', orderData?.payment?.status || "PENDING");
  OrderTemp = OrderTemp.replace('@ProductBody', productRows);
  OrderTemp = OrderTemp.replace('@totalOrderAmount', total.toFixed(2));
  return {
    userId, html : OrderTemp
  }
}

const IV_LENGTH = 12;       // bytes
const GCM_TAG_LENGTH = 16; // bytes (128 bits)

export async function decryptData(encryptedData) {
  try {
    const combined = Buffer.from(encryptedData, "base64url");
    const iv = combined.slice(0, IV_LENGTH);
    const encryptedBytes = combined.slice(IV_LENGTH);
    const ciphertext = encryptedBytes.slice(0, encryptedBytes.length - GCM_TAG_LENGTH);
    const authTag = encryptedBytes.slice(encryptedBytes.length - GCM_TAG_LENGTH);
    const key = Buffer.from(process.env.ClinetSecretId, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const decrypted =
      decipher.update(ciphertext, null, "utf8") +
      decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Error occurred during decryption:", err);
    return null;
  }
}


