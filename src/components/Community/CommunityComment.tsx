"use client";

import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { createCommentCommunity } from "@/server-action/community.action";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";


function CommunityComment({
  countComment,
  post,
  auth
}: {
  countComment: number;
  post: any; // ideally type this from Prisma
  auth?: string
}) {
  const { id } = useParams(); // communityId
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim()) return;

    setIsCommenting(true);

    const res = await createCommentCommunity(
      id as string,
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
                <div className="flex justify-between w-full">
                  <div key={comment.id} className="flex items-start gap-2">
                    <img
                      src={comment.author.image}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {comment.author.firstname} {comment.author.lastname}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {comment.contentcomment}
                      </p>
                    </div>
                  </div>
                    <div>
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
                className="px-4 py-2 w-[5rem] h-[2.6rem] bg-black text-white rounded text-sm hover:bg-black/80 disabled:bg-black/40"
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
