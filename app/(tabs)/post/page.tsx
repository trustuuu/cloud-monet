// import {
//   ChatBubbleBottomCenterIcon,
//   HandThumbUpIcon,
// } from "@heroicons/react/24/outline";
import PorductPost from "@/app/components/post";
import { getPosts } from "@/app/products/productDML";

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
