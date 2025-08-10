import { notFound } from 'next/navigation';
import { getProfileByUsername } from '@/server-action/profile.action';
import React from 'react';

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
      <h1>{user.username}</h1>
    </div>
  );
}
