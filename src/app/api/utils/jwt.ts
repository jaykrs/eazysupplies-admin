import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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
return payload && payload.userId? payload : null;
}

export async function getUserId(request) {
const payload = await getUserFromToken(request);
return payload && payload.userId? payload.userId : null;
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
  if(!user.status) return "";
  const roles = await prisma.role.findUnique({where: {id : user.roleId}});

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


// export async function generateTransactionId(): Promise<string> {
//   return prisma.$transaction(async (tx) => {
//     await tx.$executeRawUnsafe(`
//       INSERT INTO payment_txn_counter () VALUES ()
//     `);
//     const result = await tx.$queryRawUnsafe<{ transaction_id: string }[]>(`
//       SELECT
//         CONCAT(
//           DATE_FORMAT(NOW(), '%Y%m%d'),
//           LPAD(LAST_INSERT_ID(), 4, '0')
//         ) AS transaction_id
//     `);
//     return result[0].transaction_id;
//   });
// }

