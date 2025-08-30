"use client";

import React, { useEffect, useState } from "react";
import PostContent from "@/components/PostContent";
import { formatDistanceToNow } from "date-fns";
import { CircleCheckBig, Dot, MessageCircle, MoreHorizontal, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createComment, toggleLikes, updateComment } from "@/actions/post.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PostDropdownMenu from "@/components/PostDropdownMenu";
import CommentsTree from "@/components/RenderComments";

interface ProfileProps {
  post: {
    id: string;
    content: string;
    image?: string | null;
    createdAt: Date;
    author: {
      firstname: string;
      lastname: string;
      image: string;
    };
    likes: { userId: string }[];
    comment?: any[];
    _count: { likes: number };
  };
  currentUserId: string;
  authUser: any | null;
  onPostUpdated?: (postId: string, newContent: string) => void;
}

function ProfileContent({
  post,
  currentUserId,
  authUser,
}: ProfileProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === currentUserId)
  );
  const [likeCount, setLikeCount] = useState(
    post._count?.likes ?? post.likes.length
  );

  const initialComments = post.comment ?? [];
  const [comments, setComments] = useState(initialComments);

  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [isShowComment, setIsShowComment] = useState(false);
  const [alertLike, setAlertLike] = useState(false);


  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await toggleLikes(post.id);
      if (res.success) {
        setHasLiked((prev) => !prev);
        setLikeCount((count) => (hasLiked ? count - 1 : count + 1));
      } else {
        setAlertLike(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (parentId?: string | null) => {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      const res = await createComment(post.id, newComment, parentId);
      if (res.success) {
        setComments((prev) => [
          ...prev,
          { ...res.newComment, author: authUser },
        ]);
        setNewComment("");
        setReplyToCommentId(null);
      } else {
        alert(res.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsCommenting(false);
    }
  }; 
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertLike(false)
    }, 3000);
    return () => clearTimeout(timer);
  }, [alertLike])

  const handleUpdateComment = async (
    commentId: string,
    content: string,
    userId: string
  ) => {
    const res = await updateComment(commentId, content, userId);
    if (!res.success) {
      alert(res.error || "Failed to update comment");
    }
    return res;
  };


  const isAuthor = currentUserId === (authUser?.id ?? "");

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4 pb-2 flex items-center gap-2">
          <img
            src={post.author.image}
            alt={`${post.author.firstname} ${post.author.lastname}`}
            className="rounded-full w-9 h-9 object-cover border"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center text-sm">
              <p className="font-medium truncate">
                {post.author.firstname} {post.author.lastname}
              </p>
              <Dot className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {isAuthor ? (
            <PostDropdownMenu
              postId={post.id}
            />
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          )}
        </div>

        <div className="px-4 pb-2">
          <PostContent content={post.content} />
        </div>

        {post.image && (
          <div className="border-y">
            <img
              src={post.image}
              alt="Post media"
              className="w-full object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="px-4 py-2 bg-gray-50/50">
          <div className="flex items-center gap-4 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 gap-1 ${
                hasLiked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <ThumbsUp
                size={16}
                className={hasLiked ? "fill-blue-500" : "fill-transparent"}
              />
              <span>{hasLiked ? "Liked" : "Like"}</span>
              {likeCount > 0 && (
                <span className="text-xs ml-1">({likeCount})</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-gray-600 hover:text-blue-500"
              onClick={() => setIsShowComment((prev) => !prev)}
            >
              <MessageCircle size={16} />
              <span>Comment</span>
              {comments.length > 0 && (
                <span>({comments.length})</span>
              )}
            </Button>
          </div>
        </div>
        {isShowComment && (
          <div className="border-t bg-gray-50 p-4"> 
          <div className="px-4 pb-2">
            {comments.length > 0 ? (
              <CommentsTree
                comments={comments}
                currentUserId={currentUserId}
                replyToCommentId={replyToCommentId}
                setReplyToCommentId={setReplyToCommentId}
                newComment={newComment}
                setNewComment={setNewComment}
                isCommenting={isCommenting}
                handleAddComment={handleAddComment}
                editingCommentId={editingCommentId}
                setEditingCommentId={setEditingCommentId}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                updateComment={handleUpdateComment}
                setComments={setComments}
                auth={authUser}
              />
              ) : (
                <p className="text-gray-500 text-sm">No comments yet</p>
            )}
          </div>        
            {authUser && !replyToCommentId && editingCommentId === null && (
                <div className="flex gap-2">
                  <textarea
                    maxLength={200}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border rounded px-3 py-2 text-sm"
                  />
                  <Button
                    onClick={() => handleAddComment()}
                    disabled={isCommenting}
                    className="px-4 py-2 w-[5rem] h-[2.6rem] bg-black text-white rounded text-sm hover:bg-black/50 disabled:bg-black/40"
                  >
                      {isCommenting ? "Posting..." : "Post"}
                  </Button>
                </div>
              )}
          </div>
        )}

        {alertLike && (
        <Alert
          variant="default"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-red-300 bg-red-50"
        >
          <div className="flex items-start gap-3">
            <CircleCheckBig className="text-red-600 mt-1" />
            <div>
              <AlertTitle className="text-red-800 text-sm font-semibold">
                Authentication required
              </AlertTitle>
              <AlertDescription className="text-red-700 text-sm">
                Please log in to like this post.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
        

      </div>
    </div>
  );
}


export default ProfileContent;
