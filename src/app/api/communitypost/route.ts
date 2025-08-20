import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from '@/lib/jwt';


export async function POST(request: Request){
    try {
    const body = await request.json();
    const { content } = body;

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
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

    const post = await prisma.communityPost.create({
        data:{
            contentpost: content,
            department: user.type,
            AuthorId: userId,

        }
    })

    return NextResponse.json({ success: true, post }, { status: 201 });
 } catch(error){
    console.error("Error creating community post:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
 }

}