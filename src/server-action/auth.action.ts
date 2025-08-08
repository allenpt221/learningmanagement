'use server';

import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { generateTokens, verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Response shape
interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
}

// SIGN UP
export async function Signup(formData: FormData): Promise<AuthResponse> {
  try {
    const username = formData.get('username') as string;
    const emailRaw = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const email = emailRaw?.toLowerCase().trim();

    if (!username || !email || !password || !confirmPassword) {
      return { success: false, message: 'All fields are required.' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return { success: false, message: 'Email is already in use.' };
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return { success: false, message: 'Username is already in use.' };
    }



    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, userId: user.id };
  } catch (error: any) {
    console.error('Error in Signup function:', error);
    return { success: false, message: 'Something went wrong during sign up.' };
  }
}

// LOG IN
export async function LogIn(formData: FormData): Promise<AuthResponse> {
  try {
    const emailRaw = formData.get('email') as string;
    const password = formData.get('password') as string;

    const email = emailRaw?.toLowerCase().trim();

    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return { success: false, message: 'Invalid credentials.' };
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    cookies().set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    console.error('Error in LogIn function:', error);
    return { success: false, message: 'Something went wrong during login.' };
  }
}

export async function LogOut(){

  const cookieStore = cookies();

  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  return { success: true, message: 'Logout successful' };
}


export async function getProfile() {
  try {
    const token = cookies().get('accessToken')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized' };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return { success: false, message: 'Invalid token' };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        image:true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error in getProfile:', error);
    return { success: false, message: 'Something went wrong' };
  }
}
