'use server'
import prisma from "@/lib/prisma";
import { getProfile } from "./auth.action";
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from "next/cache";


export async function createCommunity(formData: FormData) {
  try {
    const profile = await getProfile();

    if (!profile.success || !profile.user) {
      return { success: false, message: "Unauthorized" };
    }

    const alreadyCreate = await prisma.community.findFirst({
      where: {
        AuthorId: profile.user?.id
      }
    })

    if(alreadyCreate){
      return { success: false, message: "You can only create one community" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get('image') as File | null;

    if(!title || !description || !image){
      return { success: false, message: "Please fill in all fields including an image."}
    }

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

    revalidatePath('/community')
    return { success: true, message: "Sucessfully Created", post: community };
  } catch (error: any) {
    console.error("Error creating community:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function getCommunities() {
  try {
    const profile = await getProfile();

    const whereClause = profile.user
      ? { department: profile.user.type }
      : {}; // if no user or want all, return all communities

    const communities = await prisma.community.findMany({
      where: whereClause,
      include: {
        author: true,
      },
    });

    return { community: communities }; 
  } catch (error) {
    console.error('Error fetching communities', error);
    return { community: [] }; 
  }
}

export async function getCommunityById(id: string) {
  try {

    const communityContent = await prisma.community.findUnique({
      where: { id },
      include: {
        author: true
      }
    })

    return communityContent;

  } catch (error) {
    console.error('Error fetching communitiy by id', error);
  }

}

export async function createCommunityPost(formData: FormData, communityId: string) {
  try {
    const profile = await getProfile();

    const contentpost = formData.get("content") as string;

    if (!profile.user || !profile.success) {
      return { success: false, message: "Unauthorized, Please Log in to post in community" };
    }


    const communitypost = await prisma.communityPost.create({
      data: {
        AuthorId: profile.user.id,
        contentpost,
        department: profile.user.type,
        communityId, 
      },
    });

    revalidatePath(`community/${communityId}`)

    return { success: true, communitypost, message: "successfully post in community." };
  } catch (error: any) {
    console.error("Error posting in community:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function getCommunityPost(communityId: string) {
  try {

    const getPostCommunity = await prisma.communityPost.findMany({
      where: { communityId },
      include: { 
        author: true,
        communitycomment: {
          include: {
            author: true
          }
        },
        _count: {
          select: {
            communitycomment: true
          }
        }

      },
      orderBy: {
        createdAt: "desc"
      },
    })

    return getPostCommunity
  
  } catch (error: any) {
    console.error("Error fetching the post in community:", error);
  }
}

export async function createCommentCommunity(
  communityId: string,
  communitypostId: string,
  content: string,
  communityparentId?: string | null,
) {
  try {
    const profile = await getProfile();

    if (!profile.user) {
      return { success: false, message: "Unauthorized, please log in to comment." };
    }

    const newComment = await prisma.communityComment.create({
      data: {
        AuthorId: profile.user.id,
        contentcomment: content,
        communitypostId,
        communityparentId: communityparentId ?? null,
        communityId
      },
    });

    revalidatePath(`/community/${communityId}`)

    return { success: true, comment: newComment };
  } catch (error: any) {
    console.error("Error in create comment community:", error);
    return { success: false, message: "Something went wrong while creating comment." };
  }
}

export async function deleteCommunityPost(postId: string, communityId: string){
  try {
    await prisma.communityPost.delete({
      where: {
        id: postId
      }
    })
    
    revalidatePath(`/community${communityId}`)

    return { success: true, message: "delete post successfully" }
  } catch (error: any) {
    console.error("Error deleting post community");
  }
}

export async function deleteCommunityComment(commentId: string, communityId: string){
  try {
    await prisma.communityComment.delete({
      where: {
        id: commentId
      }
    })
    
    revalidatePath(`/community${communityId}`)

    return { success: true, message: "delete comment successfully" }
  } catch (error: any) {
    console.error("Error deleting comment community");
  }
}

export async function updatePostCommunity(formData: FormData, postId: string){
  try {
    
    const content = formData.get("content") as string;


    const updatePost = await prisma.communityPost.update({
      where: {
        id: postId
      },
      data: {
        contentpost: content,
      },
    })


    revalidatePath('/')
    return updatePost;

  } catch (error: any) {
    console.error("Error Updating the Community Post", error);

  }
}

export async function getCommunityPostById(postId: string) {
  try {
    const communityPostId = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { 
        author: true,
        createdAt: true,
        contentpost: true,
        communitycomment: {
          include: {
            author: true,
          }
        },
        _count: {
          select: {
            communitycomment: true
          }
        }
      }
    });

    return communityPostId;
  } catch (error: any) {
    console.error("Error fetching the community post:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string){
  try {
    await prisma.community.delete({
      where: {
        id: communityId
      }
    });

    revalidatePath('/community');
  } catch (error) {
    console.error("error deleting the community", error);
  }
}

