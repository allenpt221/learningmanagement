"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { CircleCheckBig, Ellipsis } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { ConfirmationDeletion } from "./ConfirmationDeletion";
import { deleteCommunity } from "@/server-action/community.action";

interface PostDropdownMenuProps {
  communityId: string;
}

export function DropdownCommunity({ communityId }: PostDropdownMenuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [UpdateModal, setUpdateModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-md shadow-lg bg-white border border-gray-200 z-50"
        >
          <DropdownMenuItem 
          onClick={() => setUpdateModal(true)}
          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
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

      {deleteAlert && (
        <Alert
          variant="destructive"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-green-300 bg-green-50"
        >
          <div className="flex items-start gap-3">
            <CircleCheckBig className="text-green-500" />
            <div>
              <AlertTitle className="text-green-900 text-sm font-bold">
                Post Deleted
              </AlertTitle>
              <AlertDescription className="text-green-700 text-sm">
                The post has been removed successfully. This action cannot be undone.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {isModalOpen && (
        <ConfirmationDeletion 
            isOpen={true}
            onConfirm={() => deleteCommunity(communityId)}
            onCancel={() => setIsModalOpen(false)}

        /> )}

    </>
  );
}
