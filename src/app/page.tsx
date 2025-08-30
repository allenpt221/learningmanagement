// app/page.tsx

import CreatePost from "@/components/CreatePost";
import { getProfile, getRandomUsers } from "@/action/auth.action";
import { getPostsByDepartmentType, getThePost } from "@/action/post.action";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import PostCard from "@/components/PostCard";

export const DEPARTMENT_MAP = {
  CCS: 'College of Computing Studies',
  CBS: 'College of Business Studies',
  CEA: 'College of Engineering and Arts'
} as const;

async function Home() {
  const profile = await getProfile();
  const posts = profile?.user
    ? await getPostsByDepartmentType(profile.user.type) 
    : await getThePost();


  const randomUsersRaw = await getRandomUsers();

  // Add isFollowing explicitly (all suggestions are not followed yet)
  const randomUsers = randomUsersRaw.map(user => ({
    ...user,
    isFollowing: false
  }));

  return (
    <div className="flex max-w-7xl mx-auto px-4 py-8 gap-8 w-full">
      {/* Main Content */}
      <main className="flex-1">
        {profile?.user && (
          <div className="mb-8 bg-white rounded-lg w-full">
            <CreatePost
              image={profile.user.image}
              firstname={profile.user.firstname}
              lastname={profile.user.lastname}
            />
          </div>
        )}
          {/* the sidebar in mobile screen */}
              {profile?.user && randomUsers.length > 0 && (
                <aside className="xl:hidden lg:block w-full mb-5 h-fit max-h-[12rem] overflow-hidden overflow-y-auto space-y-4 py-3 px-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Suggested follow</h2>
                  </div>

                  {randomUsers.map((user) => (
                    <div key={user.id} className="space-y-3">
                      <div className="flex lg:flex-row flex-col lg:items-center gap-2 justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Link href={`profile/${user.username}`}>
                          <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden ">
                                <img src={user.image} alt={`invalid fetch image: ${user.username}`} />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{user.username}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                          </div>
                        </Link>

                        <FollowButton 
                          targetUserId={user.id}
                          isFollowing={user.isFollowing}
                          isLoggedIn={!!profile.user}  
                        />
                      </div>
                    </div>
                  ))}
                </aside>
              )}
        
        <section className="bg-white rounded-lg shadow sm:p-6 p-2">
          {posts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No posts available. Be the first to share something!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={{
                    ...post,
                    comment: post.comment.map(c => ({ ...c, author: c.author }))
                  }} 
                  isAuthor={post.author.id === profile?.user?.id} 
                  currentUserId={profile?.user?.id ?? ""} 
                  auth={profile?.user ?? null}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sidebar */}
      {profile?.user && randomUsers.length > 0 && (
        <aside className="xl:block hidden w-[25rem] h-fit space-y-4 py-3 px-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Suggested follow</h2>
          </div>

          {randomUsers.map((user) => (
            <div key={user.id} className="space-y-3">
              <div className="flex lg:flex-row flex-col lg:items-center gap-2 justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Link href={`profile/${user.username}`}>
                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                        <img src={user.image} alt={`invalid fetch image: ${user.username}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{user.username}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{DEPARTMENT_MAP[user.type as keyof typeof DEPARTMENT_MAP]}</p>
                      </div>
                  </div>
                </Link>

                <FollowButton 
                  targetUserId={user.id}
                  isFollowing={user.isFollowing}
                  isLoggedIn={!!profile.user}  
                />
              </div>
            </div>
          ))}
        </aside>
      )}
    </div>
  );
}

export default Home;