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
  const [postImageFiles, setPostImageFiles] = useState<File[]>([]);
  const [postImagePreviews, setPostImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle multiple image upload and generate previews
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to Array
    const filesArray = Array.from(files);

    // Append new files to existing ones
    const updatedFiles = [...postImageFiles, ...filesArray];

    // Limit number of images (optional)
    if (updatedFiles.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    setPostImageFiles(updatedFiles);

    // Generate previews for new files
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPostImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove one image by index
  const handleRemoveImage = (index: number) => {
    setPostImageFiles((files) => files.filter((_, i) => i !== index));
    setPostImagePreviews((previews) => {
      URL.revokeObjectURL(previews[index]);
      return previews.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!postText.trim() && postImageFiles.length === 0) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", postText.trim());

      postImageFiles.forEach((file) => {
        formData.append("image", file); // Append multiple images with same key "image"
      });

      const result = await createPost(formData);

      if (result.success) {
        setPostText("");
        setPostImageFiles([]);
        // Revoke all object URLs to avoid memory leaks
        postImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setPostImagePreviews([]);
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
    <div className="flex justify-center py-4">
      <div className="w-full max-w-6xl border rounded-2xl p-4 shadow-sm bg-white">
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
        {postImagePreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {postImagePreviews.map((preview, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt={`Post preview ${index + 1}`}
                  className="object-cover w-full h-60 rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
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
            disabled={loading || (!postText.trim() && postImageFiles.length === 0)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
