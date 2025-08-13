"use client";
import React, { useState } from "react";
import { toggleFollow } from "@/server-action/auth.action";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing?: boolean;
  isLoggedIn: boolean;
}

export default function FollowButton({ targetUserId, isFollowing, isLoggedIn }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleClick = async () => {
    if (!isLoggedIn) {
      alert("You must be logged in to follow users.");
      return;
    }

    try {
      await toggleFollow(targetUserId);
      setFollowing(!following); // toggle state locally
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mt-2 px-4 py-1 bg-black text-white rounded hover:bg-black/50 transition text-xs"
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
