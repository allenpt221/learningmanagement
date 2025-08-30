'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from '@/components/ui/button';
import {  Ellipsis, SquarePen, Trash } from 'lucide-react';

import { deleteCommunityPost } from "@/actions/community.action";
import { useParams } from "next/navigation";
import { useState } from "react";
import UpdateCommunityPost from "../Modal/UpdateCommunityPost";


function PostDelete({postId}: {postId: string}) {
    const params = useParams();
    const communityId = params.id as string;
    const [openModal, setOpenModal] = useState(false);


    
  return (
    <div>
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
            className="w-32 rounded-md shadow-lg bg-white border border-gray-200 z-50"
            >
            <DropdownMenuItem
            onClick={() => setOpenModal(true)}
            className="flex gap-2 items-center justify-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
                Edit
                <SquarePen size={15} />
            </DropdownMenuItem>
            <DropdownMenuItem
                className="flex gap-2 items-center justify-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-red-600"
                onClick={() => deleteCommunityPost(postId, communityId)}
            >
                Delete
                <Trash size={15}/>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

       {openModal && (
            <UpdateCommunityPost 
                isClose={() => setOpenModal(false)}
                postId={postId}
                />
        )}

    </div>
  )
}

export default PostDelete