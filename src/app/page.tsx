
// app/page.tsx

import CreatePost from "@/components/CreatePost";
import { getProfile, getRandomUsers } from "@/server-action/auth.action";
import { getPostsByDepartmentType, getThePost } from "@/server-action/post.action";
import { PostCard } from "@/components/PostCard";
import FollowButton from "@/components/FollowButton";


export default async function Home() {
  const profile = await getProfile();
  const posts = profile?.user
    ? await getPostsByDepartmentType(profile.user.type) 
    : await getThePost();

  const randomUsers = await getRandomUsers();




  return (
    <div className="flex max-w-6xl mx-auto px-4 py-8 gap-8">
      {/* Main Content */}
      <main className="flex-1">
        {profile?.user && (
          <div className="mb-8 bg-white rounded-lg shadow p-4">
            <CreatePost
              image={profile.user.image}
              firstname={profile.user.firstname}
              lastname={profile.user.lastname}
            />
          </div>
        )}
        
        <section className="bg-white rounded-lg shadow sm:p-6 p-2">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Posts</h2>
          
          {posts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No posts available. Be the first to share something!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={{...post,comment: post.comment.map(c => ({...c, author: c.author, })), }} // remap to match PostCard's expected type
                isAuthor={post.author.id === profile?.user?.id} currentUserId={profile?.user?.id ?? ""} auth={profile?.user ?? null}/>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sidebar */}
      {profile?.user && (
        <aside className="lg:block hidden w-80  h-fit space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Who to follow</h2>
              <button className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                Refresh
              </button>
            </div>
          {randomUsers.map((users) => (
              <div className="space-y-3">
                {/* Sample follow suggestion - repeat this block for each suggestion */}
                <div className="flex lg:flex-row flex-col lg:items-center gap-2 justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                      <img src={users.image} alt={`invalid fetch image:${users.username}`}  />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{users.username}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{users.email}</p>
                    </div>
                  </div>
                    <FollowButton 
                    targetUserId={users.id}
                    isLoggedIn={!!profile.user}  />
                </div>
              </div>
          ))}
        </aside>
      )}
    </div>
  );
}




