import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateTokens } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set cookie for browser requests
    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
      sameSite: "lax",
    });

    return Response.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken, // So Postman or mobile apps can use it
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
