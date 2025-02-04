import db from "@/app/lib/db";
// import {
//   ChatBubbleBottomCenterIcon,
//   HandThumbUpIcon,
// } from "@heroicons/react/24/outline";
import PorductPost from "@/app/components/post";

async function getPosts() {
  //await new Promise((resolve) => setTimeout(resolve, 10000));
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      owner: {
        select: {
          username: true,
          avatar: true,
        },
      },
      comments: {
        select: {
          payload: true,
          owner: true,
          created_at: true,
          id: true,
          userId: true,
          postId: true,
        },
      },
      userId: true,

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return posts;
}

export const metadata = {
  title: Life,
};

export default async function Life() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col">
      {posts.map((post) => (
        <PorductPost key={post.id} {...post} />
      ))}
    </div>
  );
}
