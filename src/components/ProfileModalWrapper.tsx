'use client';

import { useProfileModal } from "@/context/ProfileModalContext";
import ProfilePage from "@/components/Modal/Profile";
import { AnimatePresence } from "framer-motion";

export default function ProfileModalWrapper() {
  const { isOpen, close } = useProfileModal();

  return (
    <AnimatePresence>
      {isOpen && <ProfilePage isOpen={isOpen} isClose={close} />}
    </AnimatePresence>
  );
}
