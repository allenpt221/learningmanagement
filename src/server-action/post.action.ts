'use server';
import prisma from '@/lib/prisma';
import { getProfile } from './auth.action';
import cloudinary from '@/lib/cloudinary';
import { DepartmentType, Post, User } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  // Get logged-in user
  const profile = await getProfile();
  if (!profile.success || !profile.user) {
    return { success: false, message: "Unauthorized" };
  }
  const text = formData.get('text') as string;
  const image = formData.get('image') as File | null;

  let imageUrl: string | null = null;

  // Upload image if provided
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

  revalidatePath('/');

  // Save post
  const newPost = await prisma.post.create({
    data: {
      AuthorId: profile.user.id,
      content: text,
      image: imageUrl || '',
      department: profile.user.type
    },
  });

  return { success: true, post: newPost };
}

export async function getThePost(): Promise<(Post & { author: User })[]>{
  try {
    const getPost = await prisma.post.findMany({
      include:{
        author: true
      },
      orderBy: { createdAt: "desc"}
    });

    return getPost;
  } catch (error) {
    throw new Error("Error fetching the posts");
  }
}


export async function getPostsByDepartmentType(department: DepartmentType) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          type: department,  // filter posts by author's department type
        },
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    throw new Error("Error fetching posts by department");
  }
}

export async function deletePost(postId: string){
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId
      }
    });

    revalidatePath('/')

    return { success:true, deletedPost };
  } catch (error) {
    throw new Error("Deleting Post");
  }
}
