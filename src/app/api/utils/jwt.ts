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

function authenticate(request) {
    const token = parseAuthCookie(request.headers.get("cookie"));
    return token ? verifyJwt(token) : null;
}

export async function verifyAdmin(request) {
  try {
    const payload = authenticate(request);
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

