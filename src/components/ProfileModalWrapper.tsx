// src/components/ProfileModalWrapper.tsx
'use client';

import { useProfileModal } from "@/context/ProfileModalContext";
import ProfilePage from "@/components/Modal/Profile";

export default function ProfileModalWrapper() {
  const { isOpen, close } = useProfileModal();
  return <ProfilePage isOpen={isOpen} isClose={close} />;
}