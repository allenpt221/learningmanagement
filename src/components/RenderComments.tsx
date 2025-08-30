import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User, Comment as PrismaComment, DepartmentType } from "@/generated/prisma";
import { Trash2 } from "lucide-react";
import { deletePostComment } from "@/action/post.action";

type CommentWithAuthor = PrismaComment & { author: User };

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

interface CommentsTreeProps {
  comments: CommentWithAuthor[];
  currentUserId: string;
  replyToCommentId: string | null;
  setReplyToCommentId: (id: string | null) => void;
  newComment: string;
  setNewComment: (content: string) => void;
  isCommenting: boolean;
  handleAddComment: (parentId?: string | null) => Promise<void>;
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  editingContent: string;
  setEditingContent: (content: string) => void;
  updateComment: (
    commentId: string,
    content: string,
    userId: string
  ) => Promise<{ success: boolean; error?: string }>;
  setComments: React.Dispatch<React.SetStateAction<CommentWithAuthor[]>>;
  auth: AuthUser | null;
}

function CommentsTree({
  comments,
  currentUserId,
  replyToCommentId,
  setReplyToCommentId,
  newComment,
  setNewComment,
  isCommenting,
  handleAddComment,
  editingCommentId,
  setEditingCommentId,
  editingContent,
  setEditingContent,
  updateComment,
  setComments,
  auth
}: CommentsTreeProps) {
  const [openReplies, setOpenReplies] = useState<Set<string>>(new Set());

  // Build comment tree map
  const commentTree = React.useMemo(() => {
    const map = new Map<string | undefined, CommentWithAuthor[]>();
    comments.forEach((comment) => {
      const parent = comment.parentId ?? undefined;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent)!.push(comment);
    });
    return map;
  }, [comments]);

  function toggleReplies(commentId: string) {
    setOpenReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) newSet.delete(commentId);
      else newSet.add(commentId);
      return newSet;
    });
  }

  async function handleUpdateComment(commentId: string) {
    if (!editingContent.trim()) return;

    const res = await updateComment(commentId, editingContent, currentUserId);

    if (res.success) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editingContent } : c))
      );
      setEditingCommentId(null);
      setEditingContent("");
    }
  }

  async function handleDeleteComment(commentId: string) {
    const res = await deletePostComment(commentId);

    if (res?.success) {
      setComments(prev => prev.filter(c => c.id !== commentId)); 
    }
  }

  function renderComments(parentId?: string) {
    const list = commentTree.get(parentId) || [];

    return list.map((comment) => {
      const replies = commentTree.get(comment.id) || [];
      const hasReplies = replies.length > 0;
      const isOpen = openReplies.has(comment.id);

      return (
        <div
          key={comment.id}
          className="ml-4 border-l sm:pl-4 mt-2 overflow-hidden overflow-y-auto"
        >
          <div className="flex sm:gap-3 gap-1 w-full">
            <img
              src={comment.author.image || "/default-avatar.png"}
              alt={comment.author.firstname}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {comment.author.firstname} {comment.author.lastname}
              </p>
              <div className="flex flex-col space-x-5 sm:flex-row sm:justify-between sm:items-center">
                {editingCommentId === comment.id ? (
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <div className="flex space-x-1 items-center">
                    <span className="text-sm text-gray-800 break-words sm:w-full w-[9rem]">
                    {comment.content}
                  </span>
                  {auth?.id === comment.authorId && (
                    <button className="text-red-600"
                    onClick={() => handleDeleteComment(comment.id)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                  </div>
                )}
                <p className="text-xs text-gray-500 whitespace-nowrap mt-auto">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>

              <div className="flex flex-col w-[10rem]">
                {auth && parentId === undefined && editingCommentId !== comment.id && (
                  <button
                    onClick={() => setReplyToCommentId(comment.id)}
                    className="text-xs text-start text-blue-500 hover:underline mt-1"
                  >
                    Reply
                  </button>
                )}

                {comment.author.id === currentUserId && editingCommentId !== comment.id && (
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingContent(comment.content);
                      setReplyToCommentId(null);
                    }}
                    className="text-xs text-start text-green-600 hover:underline mt-1"
                  >
                    Edit
                  </button>
                )}

                {editingCommentId === comment.id && (
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      className="px-3 py-1.5 bg-black text-white rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent("");
                      }}
                      className="px-3 py-1.5 bg-gray-300 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {hasReplies && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-xs text-start text-gray-600 hover:underline mt-1"
                  >
                    {isOpen ? `Hide replies` : `View replies (${replies.length})`}
                  </button>
                )}
              </div>

              {replyToCommentId === comment.id && editingCommentId === null && (
                <div className="mt-2 flex sm:flex-row flex-col gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Reply to ${comment.author.firstname}...`}
                    className="flex-1 sm:w-full w-[10rem] border rounded px-3 py-2 text-sm"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAddComment(comment.id)}
                      disabled={isCommenting}
                      className="px-4 sm:py-2 py-1 w-[5rem] sm:h-[3rem] h-[2rem] bg-black text-white rounded text-sm hover:bg-black/50 disabled:bg-black/40"
                    >
                      {isCommenting ? "Posting..." : "Reply"}
                    </button>
                    <button
                      onClick={() => {
                        setReplyToCommentId(null);
                        setNewComment("");
                      }}
                      className="px-2 sm:py-2 py-1 text-sm w-[5rem] sm:h-[3rem] h-[2rem] rounded text-gray-500 hover:bg-black/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {isOpen && renderComments(comment.id)}
            </div>
          </div>
        </div>
      );
    });
  }

  return <>{renderComments(undefined)}</>;
}

export default CommentsTree;
