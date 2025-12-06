import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import PorductPost from "@/app/components/post";
import { getPost } from "@/app/products/productDML";

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  //revalidate: 60,
});

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //const id = Number(params.id);
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

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
    </div>
  );
}
