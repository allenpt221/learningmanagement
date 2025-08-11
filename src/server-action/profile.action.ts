"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


interface UserTypeUpdate {
    success: boolean;
    user: {
        username: string;
        firstname: string;
        lastname: string;
        image: string;
    }
}

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

export async function updateProfile(formData: FormData): Promise<UserTypeUpdate> {
  try {
    const id = formData.get("id") as string; // assuming you pass user ID
    const username = formData.get("username") as string;
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id) throw new Error("User ID is required");

    let ImageUrl = null;

    if(imageFile && imageFile.size > 0 ){
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const uploadResult = await cloudinary.uploader.upload(
        `data:${imageFile.type};base64,${base64}`,
        {
          folder: "profile",
        }
      );

      ImageUrl = uploadResult.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        firstname,
        lastname,
        ...(ImageUrl ? { image: ImageUrl } : {}),
      },
      select: {
        username: true,
        firstname: true,
        lastname: true,
        image: true,
      },
    });

    revalidatePath(`/profile/${username}`)
    return {success: true, user: updatedUser};
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}