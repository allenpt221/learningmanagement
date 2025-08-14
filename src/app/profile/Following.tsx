'use client'
import FollowingModal from '@/components/Modal/FollowingModal';
import React, { useState } from 'react'

interface FollowingProps {
  following: any[]; // Array of followings
}

function Following({ following }: FollowingProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 text-xs font-semibold"
      >
        Following
      </button>

      {isOpen && (
        <FollowingModal
          isOpen={isOpen}
          isClose={() => setIsOpen(false)}
          followings={following}
        />
      )}
    </>
  )
}

export default Following;
