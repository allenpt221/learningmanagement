"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { deletePost } from "@/server-action/post.action";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";
import { ConfirmationDeletion } from "./Modal/ConfirmationDeletion";

interface PostDropdownMenuProps {
  postId: string;
}


export function PostDropdownMenu({ postId }: PostDropdownMenuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

    async function handleConfirmDelete() {
      setIsDeleting(true);
      try {
        await deletePost(postId);
        alert("Post deleted successfully.");
        // refresh or update UI here
      } catch {
        alert("Failed to delete post.");
      } finally {
        setIsDeleting(false);
        setIsModalOpen(false);
      }
    }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-gray-100" disabled={isDeleting}>
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-md shadow-lg bg-white border border-gray-200 z-50"
      >
        <DropdownMenuItem className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
          Edit Post
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-red-600"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Post"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      <ConfirmationDeletion
          isOpen={isModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsModalOpen(false)}
        />
    </>

  );
}