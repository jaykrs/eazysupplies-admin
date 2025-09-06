
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
  
    const response = NextResponse.json({ message: 'Logout successful'},{status: 200});

    response.cookies.set('authToken', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

