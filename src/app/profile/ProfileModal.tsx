'use client';

import ProfilePage from "@/components/Modal/Profile";
import { useState } from "react";
import React from "react";

function ProfileModal({ click }: { click: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button 
      className="border px-3 py-1 rounded bg-black text-white"
      onClick={() => setIsOpen(true)}>
        {click}
      </button>
      {isOpen && (
        <ProfilePage
          isOpen={true}
          isClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default ProfileModal;
