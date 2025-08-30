import { Metadata } from 'next';
import React from 'react';
import { getCommunityById, getCommunityPost } from '@/action/community.action';
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import { Clock,  FileText,  MessageSquareMore, UserRound, UserRoundX } from 'lucide-react';
import CommunityPost from '@/components/Community/CommunityPost';
import CommunityComment from '@/components/Community/CommunityComment';
import { getProfile } from '@/action/auth.action';
import PostDelete from '@/components/Community/PostDelete';

interface CommunityProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CommunityProps): Promise<Metadata> {
  const community = await getCommunityById(params.id);


  return {
    title: community?.title || 'Community',
    description: community ? `View ${community.title}` : 'Community page',
  };
}

async function Page({ params }: CommunityProps) {
  const community = await getCommunityById(params.id);

  const postCommunity = await getCommunityPost(params.id);

  const profile = await getProfile();



  if (!postCommunity) {
    return <p>Loading...</p>;
  }

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 p-6 text-center bg-gray-50 rounded-lg">
        <div className="text-6xl text-gray-400 mb-4">
          <UserRoundX size={50} />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800">Community not found</h3>
        <p className="text-gray-600 max-w-md mb-6">
          The community you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          className="px-5 py-2.5 bg-black text-white rounded-md hover:bg-black/50 transition-colors font-medium"
          href={'/community'}
        >
          Browse Communities
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 gap-8 w-full'>
      <div className='flex flex-col-reverse lg:flex-row gap-8'>
        <main className='flex-1 bg-white rounded-xl shadow-sm sm:p-6 p-3 border border-gray-200'>
          <CommunityPost />
          
          <div className='bg-gray-50 sm:p-6 p-3 rounded-lg mb-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Community Content</h2>
            {/* post content */}
            {postCommunity.length > 0 ? (
              postCommunity.map((post) => (
                <div key={post.id} className='bg-white rounded-xl shadow-sm sm:p-5 p-3 mb-5 border border-gray-100 transition-all duration-300 hover:shadow-md'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center space-x-3'>
                      <img 
                        src={post.author.image} 
                        className='sm:h-12 sm:w-12 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm' 
                        alt={`${post.author.firstname} ${post.author.lastname}`} 
                      />
                      <div>
                        <p className='font-medium text-gray-900'>{post.author.firstname} {post.author.lastname}</p>
                        <p className='text-xs text-gray-500'>
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {profile.user && (
                      <button className='text-gray-400 hover:text-gray-600 transition-colors'>
                        {profile.user.id === post.author.id && (
                            <PostDelete postId={post.id} />
                        )}
                      </button>
                    )}
                  </div>
                  
                  <p className='mt-4 text-gray-800 whitespace-pre-line text-sm'>{post.contentpost}</p>      
                  <div className='mt-4 pt-4 border-t border-gray-100 flex items-center text-gray-500'>
                      <CommunityComment countComment={post._count.communitycomment} post={post} auth={profile.user?.id} profile={profile}/>            
                  </div>
                  <div>
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-white rounded-xl shadow-sm p-8 text-center'>
                <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <FileText />
                </div>
                <h3 className='text-lg font-medium text-gray-700 mb-2'>No posts yet</h3>
                <p className='text-gray-500'>Be the first to share something with the community!</p>
              </div>
            )}
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-blue-50 p-4 rounded-lg border border-blue-100'>
              <h3 className='font-medium text-blue-800 mb-2'>Discussion</h3>
              <p className='text-sm text-blue-600'>Start a conversation with the community</p>
            </div>
            <div className='bg-green-50 p-4 rounded-lg border border-green-100'>
              <h3 className='font-medium text-green-800 mb-2'>Resources</h3>
              <p className='text-sm text-green-600'>Share helpful resources</p>
            </div>
          </div>
        </main>
        
        <aside className='w-full lg:w-80 flex-shrink-0'>
          <div className='bg-white rounded-xl shadow-sm p-5 border border-gray-200 sticky top-24'>
            <div className='mb-5'>
              <img 
                src={community.image} 
                alt={"error fetching image"} 
                className='w-full h-48 object-cover rounded-lg mb-4'
              />
              <h2 className='text-xl font-bold text-gray-900 mb-2'>{community.title}</h2>
              <p className='text-sm text-gray-600 mb-4'>{community.description}</p>
            </div>
            
            <div className='space-y-4 border-t border-gray-100 pt-4'>
              <div className='flex items-center'>
                <div className='bg-blue-100 p-2 rounded-lg mr-3'>
                  <Clock className='text-blue-500'/>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Joined in community</p>
                  <p className='text-sm font-medium text-gray-900'>{formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
              
              <div className='flex items-center'>
                <div className='bg-purple-100 p-2 rounded-lg mr-3'>
                  <UserRound className='text-purple-800' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Community Founder</p>
                  <p className='text-sm font-medium text-gray-900'>{community.author?.firstname} {community.author?.lastname}</p>
                </div>
              </div>
              
              
              <button className='w-full border border-gray-300 hover:bg-gray-50 text-gray-800 py-2.5 rounded-lg space-x-1 font-medium transition-colors flex items-center justify-center'>
                <MessageSquareMore size={18} />
                <p>
                  Start Discussion
                </p>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Page;