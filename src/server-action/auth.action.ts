'use server';

import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';


export async function Signup(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!username || !email || !password || !confirmPassword) {
    return { success: false, message: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match' };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, message: 'Email is already in use' };
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
}


