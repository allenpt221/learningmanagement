'use client';
import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import FollowButton from '@/components/FollowButton';

interface FollowingModalProps {
  followings: any[];
  isOpen: boolean;
  isClose: () => void;
  profile: any;
}

function FollowingModal({ followings, isOpen, isClose, profile }: FollowingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-4 w-[30rem] rounded-lg h-fit max-h-[30rem] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Following</h1>
          <button onClick={isClose}><X /></button>
        </div>

        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {followings.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <Link href={`${user.username}`} className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{user.username}</p>
                  <p className="text-gray-500 text-xs">{user.firstname} {user.lastname}</p>
                </div>
              </Link>

              {/* Follow/Unfollow button */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowingModal;
