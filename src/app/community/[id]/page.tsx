import { Metadata } from 'next';
import React from 'react';
import { getCommunityById } from '@/server-action/community.action';

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
    return <div>Community not found</div>;
  }

  return (
    <div>
      <h1>{community.title}</h1>
      <p>{community.description}</p>
    </div>
  );
}

export default Page;
