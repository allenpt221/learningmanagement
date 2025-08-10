import { notFound } from 'next/navigation';
import { getProfileByUsername } from '@/server-action/profile.action';
import React from 'react';
import ProfilePage from '@/components/Modal/Profile';
import ProfileModal from '../ProfileModal';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.username}`,
  };
}

export default async function Profile({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  
  if (!user) {
    notFound();
  }

  return (
    <div>
      {/* Show the modal immediately for this page */}
      {user.username}
      <ProfileModal click={"click"} />
    </div>
  );
}
