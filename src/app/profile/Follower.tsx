'use client'
import FollowerModal from '@/components/Modal/FollowerModal';
import React, { useState } from 'react'

interface FollowingProps {
  follower: any[]; // Array of followings
}

function Follower({ follower,  }: FollowingProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 text-xs font-semibold"
      >
        Follower
      </button>

      {isOpen && (
        <FollowerModal
          isOpen={isOpen}
          isClose={() => setIsOpen(false)}
          followers={follower}
        />
      )}
    </>
  )
}

export default Follower;
