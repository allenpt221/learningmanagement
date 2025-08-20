import { Metadata } from 'next';
import React from 'react';
import { getCommunityById } from '@/server-action/community.action';
import Link from 'next/link';

interface CommunityProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CommunityProps): Promise<Metadata> {
  // Fetch the community using the id from params
  const community = await getCommunityById(params.id);

  return {
    title: community?.title || 'Community',
    description: community ? `View ${community.title}` : 'Community page',
  };
}

async function Page({ params }: CommunityProps) {
  const community = await getCommunityById(params.id);

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-6 text-center">
        <div className="text-4xl text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="17" y1="8" x2="22" y2="13"></line>
            <line x1="22" y1="8" x2="17" y2="13"></line>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-800">Community not found</h3>
        <p className="text-gray-500 max-w-md">
          The community you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-black/50 transition-colors"
          href={'/community'}
        >
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{community.title}</h1>
      <p>{community.description}</p>
    </div>
  );
}

export default Page;
