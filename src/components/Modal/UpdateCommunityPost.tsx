'use client'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getCommunityPostById, updatePostCommunity } from '@/action/community.action';
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
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-3 overflow-hidden">
        
        {isLoading ? (
          // Skeleton loader
          <div className="animate-pulse p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-28 h-4 bg-gray-200 rounded"></div>
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
              <div className="w-3/5 h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <div className="w-24 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-3">
                <img 
                  src={userProfile.image} 
                  alt={`${userProfile.firstname} ${userProfile.lastname}`} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {userProfile.firstname} {userProfile.lastname}
                  </p>
                  <p className="text-xs text-gray-500">
                    Editing post
                  </p>
                </div>
              </div>
              <button 
                className="text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
                onClick={isClose}
                disabled={isUpdating}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              <textarea 
                value={updateContent}
                onChange={(e) => setUpdateContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[8rem] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-gray-700"
                placeholder="What would you like to update?"
                disabled={isUpdating}
              />
              {createdAt && (
                <p className="text-xs text-gray-500 text-right">
                  Posted {formatDistanceToNow(createdAt, { addSuffix: true })}
                </p>
              )}
            </div>

            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <button 
                onClick={isClose}
                disabled={isUpdating}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isUpdating || !updateContent.trim()}
                className="px-5 py-2 rounded-lg bg-black text-white font-medium hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
