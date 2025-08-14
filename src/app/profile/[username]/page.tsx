import { notFound } from 'next/navigation';
import { getFollowers, getFollowing, getProfileByUsername, getUserPosts } from '@/server-action/profile.action';
import { getProfile } from '@/server-action/auth.action';
import ProfileModal from '../ProfileModal';
import type { Metadata } from 'next';
import { ProfileContent } from '../ProfileContent';
import FollowButton from '@/components/FollowButton';
import Following from '../Following';
import Follower from '../Follower';

// Constants
const DEPARTMENT_MAP = {
  CCS: 'College of Computing Studies',
  CBS: 'College of Business Studies',
  CEA: 'College of Engineering and Arts'
} as const;

interface ProfilePageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const user = await getProfileByUsername(params.username);

  
  if (!user) return {
    title: 'Profile not found'
  };

  return {
    title: `${user.firstname} ${user.lastname} (@${user.username})`,
    description: `View ${user.firstname}'s profile, posts, and department information`
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {

  const profile = await getProfile(); // logged-in user
  const user = await getProfileByUsername(params.username, profile?.user?.id);

  if (!user) {
    notFound();
  }


  const followers = await getFollowers(user.id);

  const followings = await getFollowing(user.id);


  const userPosts = await getUserPosts(user.id);

  const normalizedPosts = userPosts.map(post => ({
    ...post,
    image: post.image ?? undefined,
    likes: Array.isArray(post.likes)
      ? post.likes.map(like => ({ userId: like.userId }))
      : post.likes,
  }));

  const isCurrentUser = profile?.user?.id === user?.id;

  return (
    <div className="max-w-3xl mx-auto py-3 space-y-4 px-4">
      {/* Profile Header Section */}
      <header className='border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col p-4 bg-white w-full'>
        <div className="flex justify-between p-4 w-full">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <img 
                src={user.image} 
                alt={`${user.firstname}'s profile`}
                className="rounded-full w-20 h-20 object-cover border-2 border-gray-100"
              />

              {/* Department */}
              <p className="text-xs text-gray-500">
                {DEPARTMENT_MAP[user.type]}
              </p>
            </div>

            
            <div className="flex flex-col ">
              <h1 className="text-lg font-semibold text-gray-800">
                {user.firstname} {user.lastname}
              </h1>
              <p className="text-gray-500 text-xs">{user.email}</p>
              {/* Followers / Following counts */}
              <div className="flex space-x-4 mt-2">
                <div>
                  <span className="font-bold">{user._count?.followers ?? 0}</span>{" "}
                  <span className="text-gray-500 text-xs"><Follower follower={followers} /></span>
                </div>
                <div>
                  <span className="font-bold">{user._count?.following ?? 0}</span>{" "}
                  <span className="text-gray-500 text-xs">
                    <Following following={followings}/>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
              {/* Follow button (if not current user) */}
              {!isCurrentUser && (
                <FollowButton 
                    targetUserId={user.id} 
                    isFollowing={user.isFollowing} 
                    isLoggedIn={!!profile?.user} 
                  />
              )}
              {/* Edit Profile Button only for current user */}
              {isCurrentUser && (
                <ProfileModal click="Edit Profile" />
              )}
      </header>
      
      {/* Posts Section */}
      <div className="space-y-4">
        {normalizedPosts.length > 0 ? (
          normalizedPosts.map(post => (
            <ProfileContent
              key={post.id}
              post={post}
              authUser={profile.user ?? null}
              currentUserId={profile.user?.id ?? ""}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200 p-4">
            {isCurrentUser ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}
          </div>
        )}
      </div>
      
    </div>
  );
}
