"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { deleteCommunity } from "@/actions/community.action";
import UpdateCommunity from "./UpdateCommunity";
import ConfirmationDeletion from "./ConfirmationDeletion";

interface PostDropdownMenuProps {
  communityId: string;
}

function DropdownCommunity({ communityId }: PostDropdownMenuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [UpdateModal, setUpdateModal] = useState(false)

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
          >
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      {isModalOpen && (
        <ConfirmationDeletion 
            isOpen={true}
            onConfirm={() => deleteCommunity(communityId)}
            onCancel={() => setIsModalOpen(false)}

        /> )}

      {UpdateModal && (
        <UpdateCommunity
        isOpen={true}
        isClose={() => setUpdateModal(false)}
        communityId={communityId}
        />
      )}

    </>
  );
}

export default DropdownCommunity;