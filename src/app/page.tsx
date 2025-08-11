
// app/page.tsx
import { Dot, Ellipsis, MessageCircle, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import CreatePost from "@/components/CreatePost";
import PostContent from "@/components/PostContent";
import { getProfile } from "@/server-action/auth.action";
import { getPostsByDepartmentType, getThePost } from "@/server-action/post.action";
import { Post, User } from "@/generated/prisma";
import { PostCard } from "@/components/PostCard";


export default async function Home() {
  const profile = await getProfile();
  const posts = profile?.user
    ? await getPostsByDepartmentType(profile.user.type) 
    : await getThePost();

    console.log(profile)

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
        
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Posts</h2>
          
          {posts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No posts available. Be the first to share something!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} isAuthor={post.author.id === profile?.user?.id} currentUserId={profile?.user?.id ?? ""}/>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sidebar */}
      <aside className="w-80 h-fit space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Who to follow</h2>
          <button className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
            Refresh
          </button>
        </div>
          <div className="space-y-3">
            {/* Sample follow suggestion - repeat this block for each suggestion */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                  {/* Profile image would go here */}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Username</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@handle</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors">
                Follow
              </button>
            </div>
          </div>
      </aside>
    </div>
  );
}




