'use client'
import { getPostById, updatePost } from '@/action/post.action';
import { X, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns';

interface UpdatePostProps {
  isClose: () => void;
  isOpen: boolean;
  postId: any;
}

function UpdatePost({ isClose, isOpen, postId }: UpdatePostProps) {
  if (!isOpen) return null;

  const [userProfile, setUserProfile] = useState({
    image: "",
    firstname: "",
    lastname: "",
  });

  const [userPost, setUserPost] = useState({
    content: "",
    image: ""
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);   // updating state
  const [fetching, setFetching] = useState(true);  // fetching initial post/user state

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch post data
  useEffect(() => {
    const fetch = async () => {
      setFetching(true);
      try {
        const post = await getPostById(postId);

        if (post?.author) {
          setUserProfile({
            image: post?.author.image || "",
            firstname: post.author.firstname || "",
            lastname: post.author.lastname || "",
          });
        }

        if (post?.createdAt) {
          setCreatedAt(new Date(post.createdAt));
        }

        if (post?.content || post?.image) {
          setUserPost({
            content: post.content || "",
            image: post.image || "",
          });
          setImagePreview(post.image || null);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [postId]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setNewImage(null);
    setImagePreview(null);
    setUserPost({ ...userPost, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle update post
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", userPost.content);

      if (newImage) {
        formData.append("image", newImage);
      } else if (!imagePreview) {
        formData.append("removeImage", "true");
      }

      await updatePost(formData, postId);
      isClose();
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-3 overflow-hidden">
        {fetching ? (
          // 🔹 Skeleton Loading
          <div className="animate-pulse p-6 space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Text skeleton */}
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
              <div className="w-3/5 h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Image skeleton */}
            <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={userProfile.image}
                  alt="User profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {userProfile.firstname} {userProfile.lastname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {createdAt ? formatDistanceToNow(createdAt, { addSuffix: true }) : ""}
                  </p>
                </div>
              </div>
              <button
                className="text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
                onClick={isClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              <textarea
                value={userPost.content}
                onChange={(e) => setUserPost({ ...userPost, content: e.target.value })}
                className="w-full min-h-[8rem] p-3 border rounded-lg focus:outline-none resize-none bg-white text-gray-700"
                placeholder="Update your post..."
              />

              {/* Image upload section */}
              <div className="flex flex-col items-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />

                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Post preview"
                      className="w-full max-h-[30rem] object-contain rounded-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                      aria-label="Remove image"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-500">Click to upload an image</span>
                  </label>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t gap-3">
              <button
                onClick={isClose}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading || (!userPost.content.trim() && !imagePreview)}
                className="px-5 py-2 rounded-lg bg-black text-white font-medium hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Updating..." : "Update Post"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UpdatePost;
