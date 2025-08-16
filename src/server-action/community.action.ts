'use server'
import prisma from "@/lib/prisma";
import { getProfile } from "./auth.action";
import cloudinary from '@/lib/cloudinary';


export async function createCommunity(formData: FormData) {
  try {
    const profile = await getProfile();

    if (!profile.success || !profile.user) {
      return { success: false, message: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get('image') as File | null;


    let imageUrl: string | null = null;

    if (image) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
    
        imageUrl = (uploaded as any).secure_url;
      }

    if (!description) {
      return { success: false, message: "Description is required" };
    }

    const community = await prisma.community.create({
      data: {
        AuthorId: profile.user.id,
        title,
        description,
        image: imageUrl || '',
        department: profile.user.type, // make sure this matches your schema
      },
    });

    return { success: true, post: community };
  } catch (error: any) {
    console.error("Error creating community:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
