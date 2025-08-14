'use client'
import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

interface FollowerModalProps {
  followers: any[]; 
  isOpen: boolean;
  isClose: () => void;
}

export const DEPARTMENT_MAP = {
  CCS: 'College of Computing Studies',
  CBS: 'College of Business Studies',
  CEA: 'College of Engineering and Arts'
} as const;



function FollowerModal({ followers, isOpen, isClose }: FollowerModalProps) {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-4 w-[30rem] rounded-lg h-fit max-h-[30rem] overflow-hidden mx-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Followers</h1>
          <button onClick={isClose}><X /></button>
        </div>

        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {followers.map((user) => (
            <div key={user.id} className="flex sm:items-center justify-between items-baseline gap-1 flex-col sm:flex-row">
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

              <div>
                {DEPARTMENT_MAP[user.type as keyof typeof DEPARTMENT_MAP] || "Unknown Department"}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowerModal;
