'use client';

import React, { createContext, useContext, useState } from 'react';

type ProfileModalContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ProfileModalContext = createContext<ProfileModalContextType | undefined>(undefined);

export const ProfileModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ProfileModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ProfileModalContext.Provider>
  );
};

export const useProfileModal = (): ProfileModalContextType => {
  const context = useContext(ProfileModalContext);
  if (!context) {
    throw new Error('useProfileModal must be used within a ProfileModalProvider');
  }
  return context;
};
