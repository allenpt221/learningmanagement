'use client'
import { X } from 'lucide-react';
import React, { useState } from 'react'

interface UpdatePostProps{
  isClose: () => void;
  isOpen: boolean
}

function UpdatePost({isClose, isOpen }: UpdatePostProps) {
  if(!isOpen) return;

  const [userProfile, setUserProfile] = useState({
      image: "",
      firstname: "",
      lastname: "",    
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-lg w-[30rem] max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button 
              className="text-black hover:bg-gray-100 rounded-full p-1 transition-colors"
              onClick={isClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
      </div>
    </div>
  )
}

export default UpdatePost