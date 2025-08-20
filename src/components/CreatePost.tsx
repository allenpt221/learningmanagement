"use client";
import React, { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { createPost } from "@/server-action/post.action";

interface ProfileType {
  image?: string;
  firstname?: string;
  lastname?: string;
}

function CreatePost({ image, firstname, lastname }: ProfileType) {
  const [postText, setPostText] = useState("");
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]; // only take first file
  if (!file) return;

  // Revoke previous preview if exists
  if (postImagePreview) {
    URL.revokeObjectURL(postImagePreview);
  }

  setPostImageFile(file);
  setPostImagePreview(URL.createObjectURL(file));
};

  // Remove one image by index
  const handleRemoveImage = () => {
    if (postImagePreview) {
      URL.revokeObjectURL(postImagePreview);
    }
    setPostImageFile(null);
    setPostImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!postText.trim() && !postImageFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", postText.trim());

      if (postImageFile) {
        formData.append("image", postImageFile); // only one file
      }

      const result = await createPost(formData);

      if (result.success) {
        setPostText("");
        handleRemoveImage();
        console.log("Post created:", result.post);
      } else {
        console.error(result.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center py-4 w-full">
      <div className="w-full  border rounded-2xl p-4 shadow-sm bg-white">
        {/* Profile row */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={image || "/default-avatar.png"}
            alt={`${firstname} ${lastname}`}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <p className="font-medium text-gray-800">
            {firstname} {lastname}
          </p>
        </div>

        {/* Text input */}
        <textarea
          placeholder="What's on your mind?"
          className="w-full border rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />

        {/* Images preview grid */}
          {postImagePreview && (
            <div className="mt-3 relative rounded-lg overflow-hidden">
              <img
                src={postImagePreview}
                alt="Post preview"
                className="object-cover w-full h-[25rem] rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
              >
                <X size={16} />
              </button>
            </div>
          )}

        {/* Action row */}
        <div className="flex justify-between items-center mt-3">
          <label className="flex items-center gap-2 text-blue-500 cursor-pointer hover:text-blue-600">
            <ImageIcon size={18} />
            <span className="text-sm font-medium">Add Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <button
            onClick={handleSubmit}
            disabled={loading || (!postText.trim() && !postImageFile)}
            className="bg-black hover:bg-black/50 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
