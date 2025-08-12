'use client'

import React, { useState } from "react"
import PostContent from "@/components/PostContent"
import { Post } from "@/generated/prisma"
import { formatDistanceToNow } from "date-fns"
import { Dot, MessageCircle, MoreHorizontal, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createComment, toggleLikes, updateComment } from "@/server-action/post.action"
import { CommentsTree } from "@/components/RenderComments"

interface ProfileProps {
  post: Post & {
    author: {
      firstname: string
      lastname: string
      image: string
    }
    likes?: Array<{ id: string } | { userId: string }>
    comment?: any[]   // From Prisma (singular)
    _count?: {
      likes: number
    }
  }
  currentUserId: string
  authUser: any | null
}

export function ProfileContent({ post, currentUserId, authUser }: ProfileProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(
    Array.isArray(post.likes) && post.likes.some(like => (like as { userId: string }).userId === currentUserId)
  )
  const [likeCount, setLikeCount] = useState(
    post._count?.likes ?? (Array.isArray(post.likes) ? post.likes.length : (typeof post.likes === 'number' ? post.likes : 0))
  )

  // Use either `comments` or `comment` from the DB
  const initialComments = post.comment ?? []
  const [comments, setComments] = useState(initialComments)

  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    try {
      const res = await toggleLikes(post.id)
      if (res.success) {
        setHasLiked(prev => !prev)
        setLikeCount(count => (hasLiked ? count - 1 : count + 1))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleAddComment = async (parentId?: string | null) => {
    if (!newComment.trim()) return
    setIsCommenting(true)
    try {
      const res = await createComment(post.id, newComment, parentId)
      if (res.success) {
        setComments(prev => [
          ...prev,
          {
            ...res.newComment,
            author: authUser,
          }
        ])
        setNewComment("")
        setReplyToCommentId(null)
      } else {
        alert(res.error || "Failed to add comment")
      }
    } catch (error) {
      console.error("Failed to add comment", error)
    } finally {
      setIsCommenting(false)
    }
  }

  const handleUpdateComment = async (commentId: string, content: string, userId: string) => {
    const res = await updateComment(commentId, content, userId)
    if (!res.success) {
      alert(res.error || "Failed to update comment")
    }
    return res
  }

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
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={16} />
          </Button>
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
              className={`h-8 gap-1 ${hasLiked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <ThumbsUp
                size={16}
                className={hasLiked ? "fill-blue-500" : "fill-transparent"}
              />
              <span>{hasLiked ? "Liked" : "Like"}</span>
              {likeCount > 0 && <span className="text-xs ml-1">({likeCount})</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-gray-600 hover:text-blue-500"
              onClick={() => setReplyToCommentId(null)}
            >
              <MessageCircle size={16} />
              <span>Comment</span>
            </Button>
          </div>
        </div>

        <div className="px-4 py-2">
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
        </div>
      </div>
    </div>
  )
}
