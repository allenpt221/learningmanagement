import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // 1️⃣ Get token from cookie (browser)
    let token = cookies().get('accessToken')?.value;

    // 2️⃣ Fallback: get token from Authorization header (Postman, mobile)
    if (!token) {
      token = request.headers.get('Authorization')?.replace('Bearer ', '');
    }

    // 3️⃣ If no token, reject
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // 4️⃣ Verify token
    const tokenPayload  = verifyToken(token);
    if (!tokenPayload || !tokenPayload.userId) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const userId = tokenPayload.userId;

    // 5️⃣ Get logged-in user and their department
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { type: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 6️⃣ Get POST data
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json({ success: false, message: 'Description required' }, { status: 400 });
    }

    // 7️⃣ Create post in DB with user's department
    const post = await prisma.community.create({
      data: {
        description,
        department: user.type, // use user's department
        AuthorId: userId,
        image: "",
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
