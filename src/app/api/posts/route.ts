import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

type PostType = {
  content: string;
  postId?: string; 
};

export async function POST(request: Request) {
  try {
    // 1️⃣ Try to get token from Authorization header
    const authHeader = request.headers.get("authorization");
    let token: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // 2️⃣ Fallback to cookie
      token = cookies().get("accessToken")?.value;
    }

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3️⃣ Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    // 4️⃣ Parse request body
    const body: PostType = await request.json();
    if (!body.content) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    // 5️⃣ Create new post
    const newPost = await prisma.post.create({
      data: {
        AuthorId: decoded.userId,
        content: body.content,
      },
    });

    return Response.json(newPost, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
