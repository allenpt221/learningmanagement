// app/page.tsx
import CreatePost from "@/components/CreatePost";
import PostContent from "@/components/PostContent";
import { Post, User } from "@/generated/prisma";
import { getProfile } from "@/server-action/auth.action";
import { getPostsByDepartmentType, getThePost } from "@/server-action/post.action";
import { Dot, MessageCircle, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type PostWithAuthor = Post & { author: User };

export default async function Home() {

  const profile = await getProfile();

  const posts = profile?.user
    ? await getPostsByDepartmentType(profile.user.type) 
    : await getThePost();

  console.log(profile)
  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {profile?.user && (
        <div className="mb-8">
          <CreatePost
            image={profile.user.image}
            firstname={profile.user.firstname}
            lastname={profile.user.lastname}
          />
        </div>
      )}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No posts available. Be the first to share something!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
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
                    <p className="truncate text-sm">
                      {post.author.firstname} {post.author.lastname}
                    </p>
                    <p className="text-xs text-black/50">{post.author.email}</p>
                  </div>
                </div>
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
                <div className="px-4 py-2 border-t bg-gray-50">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                    <div className="flex space-x-4">
                      <button className="hover:text-blue-500 transition-colors flex items-center gap-1">
                        <ThumbsUp size={15} />
                        <span className="text-xs">Like</span>
                      </button>
                      <button className="hover:text-black/50 transition-colors flex items-center gap-1">
                        <MessageCircle size={15} />
                        <span className="text-xs">Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
