import db from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import PorductPost from "@/app/components/post";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        owner: {
          select: {
            username: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
            userId: true,
            owner: true,
            payload: true,
            created_at: true,
            postId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  //revalidate: 60,
});

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  return (
    <div className="p-5 text-white">
      <PorductPost key={post.id} {...post} />
      {/* <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.owner.avatar!}
          alt={post.owner.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.owner.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>View {post.views}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        {post.comments.map((comment) => (
          <CommentComp key={comment.id} {...comment} />
        ))}
      </div>
      <div className="p-5 flex gap-1 justify-start">
        <textarea
          id="text"
          name="comments"
          rows={1}
          className="w-5/6 block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="write comments"
        />
        <Link
          className={`flex items-center gap-2 text-white text-sm border rounded-full p-2 transition-colors bg-orange-500 border-orange-500"
          }`}
          href={``}
        >
          comment
        </Link>
      </div> */}
    </div>
  );
}
