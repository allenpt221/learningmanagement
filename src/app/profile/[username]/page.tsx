import { notFound } from 'next/navigation';
import { getProfileByUsername, getUserPosts } from '@/server-action/profile.action';
import React from 'react';
import ProfileModal from '../ProfileModal';
import { getProfile } from '@/server-action/auth.action';
import { ProfileContent } from '../ProfileContent';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.username}`,
  };
}

export default async function Profile({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  const profile = await getProfile();
  const userPost = await getUserPosts(user?.id);

  console.log(userPost);

  if (!user) {
    notFound();
  }

  const normalizedUserPosts = userPost.map(post => ({
  ...post,
  likes: Array.isArray(post.likes)
    ? post.likes.map(like => ({ id: like.userId }))
    : post.likes,
}));


  return (
    <div className='max-w-3xl mx-auto py-3'>
      <div className='border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between space-x-4 p-4 bg-white'>
        <div className='flex items-center space-x-1'>
          <img 
            src={user.image} 
            alt="Profile picture" 
            className='rounded-full w-20 h-20 object-cover border-2 border-gray-100'
          />
          <div className='flex flex-col'>
            <div className='flex items-baseline space-x-2'>
              <p className='text-base font-semibold text-gray-800'>{user.firstname}</p>
              <p className='text-base font-semibold text-gray-800'>{user.lastname}</p>
            </div>
            <p className='text-gray-600 text-xs'>{user.email}</p>
          </div>
        </div>
        {profile.user && (
          <div className='mt-auto'>
            <ProfileModal click={"Edit Profile"} /> 
          </div>
        )}
      </div>
      {normalizedUserPosts.map((post) => (
        <ProfileContent 
          key={post.id}
          post={post}
          authUser={profile.user ?? null} 
          currentUserId={profile.user?.id ?? ""}
        />
      ))}
    </div>
  );
}