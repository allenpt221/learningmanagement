"use client";

import { Ellipsis, MessageCircle, Trash } from "lucide-react";
import React, { useState } from "react";
import { createCommentCommunity, deleteCommunityComment } from "@/actions/community.action";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";



function CommunityComment({
  countComment,
  post,
  auth,
  profile
}: {
  countComment: number;
  post: any; // ideally type this from Prisma
  auth?: string,
  profile: any
}) {
  const params = useParams(); // communityId
  const communityId = params.id as string;
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim()) return;

    setIsCommenting(true);

    const res = await createCommentCommunity(
      communityId,
      post.id,       // communityPostId
      commentText
    );

    if (res.success) {
      alert("Comment posted!");
      setCommentText("");
      // TODO: re-fetch comments here
    } else {
      alert(res.message);
    }

    setIsCommenting(false);
  };


  return (
    <div className="w-full">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center mr-4 hover:text-blue-600 transition-colors space-x-1"
      >
        <MessageCircle size={15} />
        <span className="text-sm">
          {countComment > 0
            ? `${countComment} ${countComment === 1 ? "comment" : "comments"}`
            : "Comment"}
        </span>
      </button>

      {showComments && (
        <div className="p-2">
          <div className="border w-full" />

          {/* comments list */}
          <div className="mt-2 text-sm text-gray-600 space-y-3">
            {post.communitycomment && post.communitycomment.length > 0 ? (
              post.communitycomment.map((comment: any) => (
                <div className="flex flex-col justify-between w-full overflow-hidden">
                  <div key={comment.id} className="flex items-center gap-2">
                    <img
                      src={comment.author.image}
                      alt="error fetching the image"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {comment.author.firstname} {comment.author.lastname}
                      </p>
                      <p className="text-gray-700 text-sm line-clamp-1">
                        {comment.contentcomment}
                      </p>
                    </div>
                    {profile?.user?.id === comment.author.id && (
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Ellipsis size={13} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                          align="end"
                          className="w-32 rounded-md shadow-lg bg-white border border-gray-200 z-50"
                          >
                          <DropdownMenuItem
                              className="flex gap-2 items-center justify-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-red-600"
                              onClick={() => deleteCommunityComment(comment.id, communityId)}
                          >
                              Delete
                              <Trash size={13}/>
                          </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>

                    )}
                  </div>
                    <div className="text-right">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true})}
                    </div>
                </div>    
              ))
            ) : (
              <span className="text-gray-500">No comments yet.</span>
            )}
          </div>

          {/* create comment */}
          {auth && (
            <div className="mt-4 flex gap-2">
              <textarea
                maxLength={280}
                value={commentText}
                rows={1}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded px-3 py-2 text-sm resize-none"
              />
              <button
                onClick={handleComment}
                disabled={isCommenting || !commentText.trim()}
                className="px-4 py-2 sm:w-[5rem] sm:h-[2.6rem] bg-black text-white rounded text-sm hover:bg-black/80 disabled:bg-black/40"
              >
                {isCommenting ? "Posting..." : "Post"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommunityComment;
