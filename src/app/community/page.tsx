import DropdownCommunity from "@/components/Modal/DropdownCommunity";
import PostContent from "@/components/PostContent";
import { getProfile } from "@/action/auth.action";
import { getCommunities } from "@/action/community.action";
import Link from "next/link";

async function Page() {
  const res = await getCommunities();
  const communities = res.community;

  const profile = await getProfile();

  return (
    <div className="max-w-6xl mx-auto py-5 px-4">
      {communities.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No communities available for your department.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities?.map((community) => (
            <div
              key={community.id}
              className="flex flex-col p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-300 h-full"
            >
              <div className="flex items-center justify-between mb-2 gap-1">
                <h2 className="text-lg font-bold line-clamp-2">
                  {community.title}
                </h2>
                {profile.user?.id === community.AuthorId && (
                  <DropdownCommunity communityId={community.id}/>
                )}
              </div>
              
              <div className="flex-grow">
                <span className="text-sm text-gray-600 mb-3">
                  <PostContent content={community.description} />
                </span>
                
                {community.image && (
                  <img
                    src={community.image}
                    alt={`Community ${community.title}`}
                    className="mt-2 w-full h-48 object-cover rounded-lg border"
                  />
                )}
              </div>

              <div className="border-t my-3" />
              
              <Link href={`community/${community.id}`} className="w-full text-center bg-black hover:bg-gray-800 py-2 px-4 rounded text-white transition duration-200">
                View Community
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;