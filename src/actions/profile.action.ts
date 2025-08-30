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

export async function getProfileByUsername(username: string, currentUserId?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        image: true,
        type: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        },
        followers: {
          where: {
            followerId: currentUserId // check if current user follows them
          },
          select: { followerId: true }
        }
      }
    });

    if (!user) return null;

    return {
      ...user,
      isFollowing: user.followers.length > 0
    };
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


export async function getUserPosts(userId: any) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        AuthorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            email: true,
            image: true,
          },
        },
        comment: {
          include: {
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error("Failed to fetch user posts");
  }
}

// Fetch all users who follow a specific user
export async function getFollowers(userId: string) {
  try {
    const followers = await prisma.follows.findMany({
      where: { followingId: userId }, // Only followers of this user
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            image: true,
            email: true,
            type: true
          },
        },
      },
    });

    // Return only the follower info
    return followers.map(f => f.follower);
  } catch (error) {
    console.error("Error fetching followers", error);
    throw new Error("Failed to fetch user followers");
  }
}

// Fetch all users that a specific user is following
export async function getFollowing(userId: string) {
  try {
    const followings = await prisma.follows.findMany({
      where: { followerId: userId }, // Only users this user is following
      select: {
        following: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            image: true,
            email: true,
            type: true,
          },
        },
      },
    });

    return followings.map(f => f.following);
  } catch (error) {
    console.error("Error fetching following", error);
    throw new Error("Failed to fetch user following");
  }
}
