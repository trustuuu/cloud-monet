import { notFound } from "next/navigation";
//import { unstable_cache as nextCache } from "next/cache";
import PorductPost from "@/app/components/post";
import { getPostByProduct, getProductLite } from "../../productDML";

// const getCachedPost = nextCache(getPost, ["post-detail"], {
//   tags: ["post-detail"],
//   //revalidate: 60,
// });

export default async function ProductPosts({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    return notFound();
  }
  const posts = await getPostByProduct(productId);

  const product = await getProductLite(productId);
  const photo = product?.photo
    ? `${product?.photo}/public`
    : "https://imagedelivery.net/Rb4GRCDlRSth88K5U-87QA/d3e4f427-6e74-4ce9-3b48-a74ac6b9c600/public";

  return (
    <div className="pt-5 pb-5 text-white">
      <label
        htmlFor="photo"
        className="w-full size-12 border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed bg-center bg-cover"
        style={{
          backgroundImage: `url(${photo})`,
        }}
      ></label>
      {posts.map((post) => (
        <PorductPost key={post.id} {...post} />
      ))}
    </div>
  );
}
