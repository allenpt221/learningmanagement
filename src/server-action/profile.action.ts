"use server";

import prisma from "@/lib/prisma";

export async function getProfileByUsername(username: string){
    try {
        const user = await prisma.user.findUnique({
            where: { username: username},
            select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                email: true,
                image: true,
                type:true
            }
        })

        return user;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error("Failed to fetch profile");
    }
}