'use server';

import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { generateTokens, verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Response shape
interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    firstname?: string;
    lastname?: string;
    email: string;
    username: string;
    image?: string;
    type?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
}

// SIGN UP
export async function Signup(formData: FormData): Promise<AuthResponse> {
  try {
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const username = formData.get('username') as string;
    const emailRaw = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const type = formData.get('department') as string;



    const email = emailRaw?.toLowerCase().trim();

    if (!username || !email || !password || !confirmPassword || !firstname || !lastname) {
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

    const departmentMap: Record<string, "CCS" | "CEA" | "CBS"> = {
      "College of Computing Studies": "CCS",
      "College of Engineering And Arts": "CEA",
      "College of Business Studies": "CBS",
    };

    const typeEnum = departmentMap[type];
    if (!typeEnum) {
      return { success: false, message: "Invalid department selected." };
    }



    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        type: typeEnum
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
        firstname: true,
        lastname: true,
        email: true,
        image:true,
        username: true,
        createdAt: true,
        type: true
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

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}


export async function getDbUserId() {
  const profile  = await getProfile();

    if (!profile?.user?.id) {
    return null; // not logged in
  }

  const user = await getUserById(profile.user?.id);

  if (!user) throw new Error("User not found");

  return user.id;
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();

    if (!userId) return [];

    // get 3 random users exclude ourselves & users that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        type: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 5,
    });

    return randomUsers;
  } catch (error) {
    console.log("Error fetching random users", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const profile = await getProfile();

    if (!profile.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    if (profile.user?.id === targetUserId) {
      throw new Error("You cannot follow yourself");
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: profile.user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: profile.user.id,
            followingId: targetUserId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: profile.user.id,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: profile.user.id,
            postId: null, // explicit for type consistency
            read: false,
            createdAt: new Date(),
          },
        }),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
}
