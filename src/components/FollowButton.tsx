"use client";
import React, { useEffect, useState } from "react";
import { toggleFollow } from "@/server-action/auth.action";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleX } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing?: boolean;
  isLoggedIn: boolean;
}

export default function FollowButton({ targetUserId, isFollowing, isLoggedIn }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn) {
      setNotLoggedIn(true);
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

  useEffect(() => {
    if (!notLoggedIn) return;
    const timer = setTimeout(() => {
      setNotLoggedIn(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notLoggedIn]);

  return (
    <>
      <button
        onClick={handleClick}
        className={`mt-2 px-4 py-2 font-medium rounded transition sm:text-sm text-xs
          ${following && isLoggedIn ? 'border bg-white text-black hover:bg-muted' : 'bg-black text-white hover:bg-black/60'}`}
      >
        {/* Always show "Follow" if not logged in */}
        {isLoggedIn ? (following ? "Unfollow" : "Follow") : "Follow"}
      </button>

      {notLoggedIn && (
        <Alert
          variant="destructive"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-red-300 bg-red-50"
        >
          <div className="flex items-start gap-4">
            <CircleX className="text-red-600 mt-1" />
            <div className="flex-1">
              <AlertTitle className="text-red-800 font-semibold text-sm">
                Authentication Required
              </AlertTitle>
              <AlertDescription className="text-red-700 text-sm mt-1">
                You must be logged in to follow users.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </>
  );
}
