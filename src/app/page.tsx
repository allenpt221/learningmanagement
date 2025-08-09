
// app/page.tsx
import { Dot, Ellipsis, MessageCircle, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import CreatePost from "@/components/CreatePost";
import PostContent from "@/components/PostContent";
import { getProfile } from "@/server-action/auth.action";
import { deletePost, getPostsByDepartmentType, getThePost } from "@/server-action/post.action";
import { Post, User } from "@/generated/prisma";
import { PostDropdownMenu } from "@/components/PostDropdownMenu";

type PostWithAuthor = Post & { author: User };

export default async function Home() {
  const profile = await getProfile();
  const posts = profile?.user
    ? await getPostsByDepartmentType(profile.user.type) 
    : await getThePost();

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
                <PostCard key={post.id} post={post} isAuthor={post.author.id === profile?.user?.id} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sidebar */}
      <aside className="w-80 space-y-6">
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-800 mb-3">Trending Topics</h3>
          <div className="space-y-2">
            {['#NewProject', '#TeamBuilding', '#TechUpdate', '#CompanyEvent'].map(tag => (
              <div key={tag} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

interface PostCardProps {
  post: PostWithAuthor;
  isAuthor: boolean;
}

function PostCard({ post, isAuthor }: PostCardProps) {
  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Post Header */}
      <div className="flex items-center p-4 border-b">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <img
            src={post.author.image || "/default-avatar.png"}
            alt={`${post.author.firstname}'s profile`}
            className="object-cover w-full h-full"
          />
        </div>
        <Dot className="text-gray-400" />
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-gray-900">
            {post.author.firstname} {post.author.lastname}
          </p>
          <p className="text-xs text-gray-500">{post.author.email}</p>
        </div>
        
        {isAuthor && (
          <PostDropdownMenu postId={post.id} />
        )}
      </div>

      {/* Post Content */}
      <div className="p-4 space-y-4">
        {post.content && <PostContent content={post.content} />}
        {post.image && (
          <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
            <img
              src={post.image}
              alt="Post image"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Post Footer */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          <div className="flex space-x-4">
            <button className="hover:text-blue-500 transition-colors flex items-center gap-1 text-gray-600">
              <ThumbsUp size={15} />
              <span className="text-xs">Like</span>
            </button>
            <button className="hover:text-blue-500 transition-colors flex items-center gap-1 text-gray-600">
              <MessageCircle size={15} />
              <span className="text-xs">Comment</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}


