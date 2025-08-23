'use client'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getCommunityPostById, updatePostCommunity } from '@/server-action/community.action';
import { formatDistanceToNow } from 'date-fns';

interface ModalProps {
  isClose: () => void;
  postId: string;
}

function UpdateCommunityPost({ isClose, postId }: ModalProps) {
  const [updateContent, setUpdateContent] = useState("");
  const [userProfile, setUserProfile] = useState({
    image: "",
    firstname: "",
    lastname: "",    
  });
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const communityPost = await getCommunityPostById(postId);

        if (communityPost?.author) {
          setUserProfile({
            image: communityPost.author.image || "",
            firstname: communityPost.author.firstname || "",
            lastname: communityPost.author.lastname || ""
          });
        }

        if (communityPost?.contentpost) {
          setUpdateContent(communityPost.contentpost);
        }
        
        if (communityPost?.createdAt) {
          setCreatedAt(new Date(communityPost.createdAt));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);

  const handleSave = async () => {
    if (!updateContent.trim() || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("content", updateContent);
      await updatePostCommunity(formData, postId);
      isClose();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white px-6 py-3 rounded-lg w-[30rem] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button 
            className="text-black hover:bg-gray-100 rounded-full p-1 transition-colors"
            onClick={isClose}
            disabled={isUpdating}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          // Loading skeleton
          <div className="animate-pulse">
            {/* User info skeleton */}
            <div className="flex items-center gap-2 mb-4 justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="mb-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            
            {/* Button skeleton */}
            <div className="flex justify-end">
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        ) : (
          // Actual content
          <>
            {/* User Info */}
            <div className='flex items-center gap-2 mb-4 justify-between'>
              <div className='font-medium flex items-center space-x-2'>
                <img 
                  src={userProfile.image} 
                  alt={`${userProfile.firstname} ${userProfile.lastname}`} 
                  className='w-10 h-10 rounded-full object-cover' 
                />
                <div>
                  <div className="font-medium">
                    {userProfile.firstname} {userProfile.lastname}
                  </div>
                  <div className="text-xs text-gray-500">
                    Editing post
                  </div>
                </div>
              </div>
              {createdAt && (
                <p className="text-sm text-gray-500">
                  Posted {formatDistanceToNow(createdAt, {addSuffix: true})}
                </p>
              )}
            </div>
            
            {/* Editable content */}
            <textarea 
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className='px-3 py-2 mb-4 w-full resize-none border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
              rows={5}
              disabled={isUpdating}
              placeholder="What would you like to update?"
            />

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Press Enter to save
              </p>
              
              {/* Save button */}
              <button 
                onClick={handleSave} 
                disabled={isUpdating || !updateContent.trim()}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/70 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : "Update Post"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UpdateCommunityPost