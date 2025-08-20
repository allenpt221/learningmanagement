'use client';

import { useEffect, useState } from "react";
import { CircleCheckBig, Dot, MessageCircle, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { createComment, toggleLikes, updateComment } from "@/server-action/post.action";
import { PostDropdownMenu } from "./PostDropdownMenu";
import PostContent from "./PostContent";

import { Post as PrismaPost, User, Comment as PrismaComment, DepartmentType } from "@/generated/prisma";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CommentsTree } from "./RenderComments";
import { Button } from "./ui/button";
import Link from "next/link";

type CommentWithAuthor = PrismaComment & { author: User };

type PostWithAuthorLikesComments = PrismaPost & {
  author: User;
  likes: { userId: string }[];
  _count?: { likes: number };
  comment: CommentWithAuthor[];
};

type SafeAuthor = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  type: DepartmentType;
  image: string;
  createdAt: Date;
};

type AuthUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  type: DepartmentType;
  image: string;
  createdAt: Date;
};

interface PostCardProps {
  post: PostWithAuthorLikesComments;
  isAuthor: boolean;
  currentUserId: string;
  auth: AuthUser | null;
}

export function PostCard({ post, isAuthor, currentUserId, auth }: PostCardProps) {
    
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === currentUserId)
  );
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? post.likes.length);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentWithAuthor[]>(post.comment || []);

  const [alertLike, setAlertLike] = useState(false);
  const [alertComment, setAlertComment] = useState(false);

  // Track which comment is being replied to (null means top-level comment)
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);

  // Track which comment is being edited (null means no editing)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // Content for the comment being edited
  const [editingContent, setEditingContent] = useState("");

  async function handleLike() {
    if (isLiking) return;
    setIsLiking(true);

    const res = await toggleLikes(post.id);
    if (res.success) {
      setHasLiked((prev) => !prev);
      setLikeCount((count) => (hasLiked ? count - 1 : count + 1));
    } else {
      setAlertLike(true);
    }
    setIsLiking(false);
  }

  async function handleAddComment(parentId?: string | null) {
    if (!newComment.trim() || isCommenting || !auth) return;
    setIsCommenting(true);

    const res = await createComment(post.id, newComment, parentId ?? null);
    if (res.success && res.newComment) {

      const safeAuthor: SafeAuthor = {
        id: auth.id,
        firstname: auth.firstname,
        lastname: auth.lastname,
        email: auth.email,
        username: auth.username,
        type: auth.type,
        image: auth.image,
        createdAt: auth.createdAt,
      };

      setComments((prev) => [
        ...prev,
        { ...res.newComment, author: safeAuthor } as CommentWithAuthor,
      ]);
      setNewComment("");
      setReplyToCommentId(null);
      setEditingCommentId(null);
      setEditingContent("");
    } else if (res.error === "Unauthorized") {
      setAlertComment(true);
    }

    setIsCommenting(false);
  }

  useEffect(() => {
    if (!alertLike && !alertComment) return;
    const timer = setTimeout(() => {
      setAlertLike(false);
      setAlertComment(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [alertLike, alertComment]);

  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Post Header */}
      <div className="flex items-center p-4 border-b">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Link href={`profile/${post.author.username}`}>
            <img
              src={post.author.image || "/default-avatar.png"}
              alt={`${post.author.firstname}'s profile`}
              className="object-cover w-full h-full"
            />
        </Link>
        </div>
        <Dot className="text-gray-400" />
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-gray-900">
            {post.author.firstname} {post.author.lastname}
          </p>
          <p className="text-xs text-gray-500">{post.author.email}</p>
        </div>
        {isAuthor && <PostDropdownMenu postId={post.id} />}
      </div>

      {/* Post Content */}
      <div className="p-4 space-y-4">
        {post.content && <PostContent content={post.content} />}
        {post.image && (
          <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
            <img src={post.image} alt="Post image" className="object-cover w-full h-full" />
          </div>
        )}
      </div>

      {/* Post Footer */}
      <div className="px-4 py-2 bg-gray-50/50 border-t">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">          
          {/* Action buttons with counts and states */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 gap-1 ${hasLiked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
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
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageCircle size={16} />
              <span>Comment</span>
              {comments.length > 0 && (
                <span className="text-xs ml-1">({comments.length})</span>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt) , { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t bg-gray-50 p-4">
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
              updateComment={updateComment}
              setComments={setComments}
              auth={auth}  // Pass auth down to CommentsTree for reply inputs control
            />
          ) : (
            <p className="text-gray-500 text-sm">No comments yet</p>
          )}

          {/* Top-level Add Comment Input (only if authenticated and not replying or editing) */}
          {auth && !replyToCommentId && editingCommentId === null && (
            <div className="mt-4 flex gap-2">
              <textarea
                maxLength={280}
                value={newComment}
                rows={1}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded px-3 py-2 text-sm resize-none"
              />
              <button
                onClick={() => handleAddComment()}
                disabled={isCommenting}
                className="px-4 py-2 w-[5rem] h-[2.6rem] bg-black text-white rounded text-sm hover:bg-black/50 disabled:bg-black/40"
              >
                {isCommenting ? "Posting..." : "Post"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Alerts */}
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

      {alertComment && (
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
                Please log in to comment on this post.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </article>
  );
}
