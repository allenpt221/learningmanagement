'use server';
import prisma from '@/lib/prisma';
import { getProfile } from './auth.action';
import cloudinary from '@/lib/cloudinary';
import { DepartmentType  } from '@/generated/prisma';
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

export async function getThePost(){
  try {

  const getPost = await prisma.post.findMany({
    include: {
      author: true,
      likes: {
        select: { userId: true }
      },
      comment: {
        where: {
          parentId: null
        },
        include: {
          author: true,
        replies: {
          include: {
            author: true,
          }
        },
      },
      },
      _count: {
        select: { likes: true, comment: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });


    return getPost;
  } catch (error) {
    throw new Error("Error fetching the posts");
  }
}


export async function getPostsByDepartmentType(department: DepartmentType){
  try {
    return await prisma.post.findMany({
      where: {
        author: { type: department },
      },
      include: {
        author: true,
        likes: { 
          select: { 
            userId: true 
          } 
        },
        comment: {
          include: {
            author: true
          }
        },
        _count: { 
          select: { 
            likes: true, 
            comment: true
          } 
        },
      },
      orderBy: { createdAt: "desc" },
    });
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

    return { success:true , deletedPost };
  } catch (error) {
    throw new Error("Deleting Post");
  }
}

export async function toggleLikes(postId: string) {
  try {
    const profile = await getProfile();

    if (!profile.success || !profile.user) {
      return { success: false, error: "Unauthorized" } as const;
    }

    const userId = profile.user.id;

    const existLikes = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { AuthorId: true }
    });

    if (!post) {
      return { success: false, error: "Post not found" } as const;
    }

    if (existLikes) {
      await prisma.like.delete({
        where: { userId_postId: { userId, postId } }
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
         data: { userId, postId }
       }),
       ...(post.AuthorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.AuthorId,
                  creatorId: userId,        
                  postId
                }
              })
            ]
          : [])


      ])
    }

    revalidatePath("/");
    revalidatePath(`/profile/${profile.user.username}`);
    return { success: true } as const;

  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" } as const;
  }
}

export async function createComment(postId: string, content: string, parentId?: string | null) {
  try {
    const profile = await getProfile();
    if (!profile.success || !profile.user) {
      return { success: false, error: "Unauthorized" } as const;
    }
    
    const userId = profile.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { AuthorId: true },
    });

    if (!post) {
      return { success: false, error: "Post not found" } as const;
    }

    const createdComment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
        parentId,
      },
      include: { author: true },
    });

    if (post.AuthorId !== userId) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          userId: post.AuthorId,
          creatorId: userId,
          postId,
          commentId: createdComment.id,
        },
      });
    }



    revalidatePath(`/`);
    return { success: true, newComment: createdComment };

  } catch (error) {
    console.error("Failed to comment on post:", error);
    return { success: false, error: "Failed to comment" } as const;
  }
}


export async function updateComment(commentId: string,content: string, currentUserId: string) {
  try {
    if (!commentId || !content.trim()) {
      return { success: false, error: "Comment ID and content are required" };
    }

    // Check ownership
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!existingComment) {
      return { success: false, error: "Comment not found" };
    }

    if (existingComment.authorId !== currentUserId) {
      return { success: false, error: "Unauthorized" };
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        author: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
    });

    return { success: true, data: updatedComment, message: "Comment updated successfully" };
  } catch (error: any) {
    console.error("Error updating comment:", error);
    if (error.code === "P2025") {
      return { success: false, error: "Comment not found" };
    }
    return { success: false, error: error instanceof Error ? error.message : "Failed to update comment" };
  }
}

export async function getNotifications() {
  try {
    const profile = await getProfile();
    if (!profile.success || !profile.user) {
      return { success: false, error: "Unauthorized" } as const;
    }

    const userId = profile.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId }, // recipient
      orderBy: { createdAt: "desc" },
      include: {
        creator: { // user who triggered the notification
          select: { id: true, username: true, firstname: true, lastname: true, image: true }
        },
        post: { // if linked to a post
          select: { 
            id: true, content: true, image: true, 
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            authorId: true,
            postId: true,
            createdAt: true,
          }
        }

      }
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return { success: false, error: "Failed to fetch notifications" } as const;
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false };
  }
}


export async function getNotificationById(id: string) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
      include: {
        creator: {   // user who triggered the notification
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            image: true,
          },
        },
        post: {      // only if it's LIKE / COMMENT
          select: {
            id: true,
            content: true,
            image: true,
            author: { 
              select: { 
                id: true, 
                username: true, 
                firstname: true, 
                lastname: true, 
                image: true 
              }
            },
            comment: {
              select: {
                id: true,
                content: true,
                createdAt: true,
              },
            },
          },
        },
        comment: {   // only if notification itself is about a comment
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!notification) return null;

    return notification;
  } catch (error) {
    console.error("Failed to fetch notification:", error);
    return null;
  }
}


export async function updatePost(formData: FormData, postId: string) {
  try {
    const file = formData.get("image") as File | null;
    const content = formData.get("content") as string;

    let imageUrl: string | undefined;

    // Upload to Cloudinary if file exists
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

       const uploadRes = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "posts" }, 
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imageUrl = uploadRes.secure_url;
    }

    // Update post in database
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });

    revalidatePath("/");

    return updatedPost;
  } catch (error) {
    console.error("Error updating the post:", error);
    throw error;
  }
}


export async function getPostById(postId: string){
  try {
    const getPost = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        content: true,
        image: true,
        author: true,
        createdAt: true,
      }
    })

    return getPost

  } catch (error) {
    console.error("error getting the post by the Id", error);
  }
}

export async function deletePostComment(commentId: string) {
  try {
    await prisma.comment.delete({ where: { id: commentId } });
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment in post", error);
    return { success: false };
  }
}

