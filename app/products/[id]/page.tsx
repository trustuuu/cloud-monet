import getSession, { IsOwner } from "@/app/lib/session";
import { UserIcon } from "@heroicons/react/20/solid";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { formatToDallar } from "@/app/lib/utils";
import FormButton from "@/app/components/button";
import { delProduct, getProduct } from "../productDML";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import PorductPost from "@/app/components/post";
import LikeButton from "@/app/components/like-button";
import db from "@/app/lib/db";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  //let title = "";
  // if (isNaN(id)) {
  //   title = "Product";
  // }
  const product = await getProduct(id);

  return {
    title: product?.title,
  };
}

// async function getProductREST(id: number) {
//   await fetch("https://api.test", {
//     next: {
//       revalidate: 60,
//       tags: ["hello"],
//     },
//   });
// }

const getCachedProductDetail = nextCache(getProduct, ["product-detail"], {
  revalidate: 60,
  tags: ["product-detail"],
});

async function getLikeStatus(productId: number, sessionId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        productId,
        userId: sessionId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      productId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProductDetail(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await IsOwner(product.userId);

  function getCachedLikeStatus(porductId: number, sessionId: number) {
    const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
      tags: [`like-status-${porductId}`],
    });
    return cachedOperation(porductId, sessionId);
  }
  const session = await getSession();
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);

  const onDelete = async () => {
    "use server";
    await delProduct(id);
    revalidatePath("/home");
    revalidateTag("product-detail");
    // revalidateTag("products");
    redirect("/home");
  };

  const onEdit = async () => {
    "use server";
    revalidatePath("/home");
    revalidateTag("product-detail");
    // revalidateTag("products");
    redirect(`/products/${id}/edit`);
  };

  const onCreateChatRoom = async () => {
    "use server";
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  };

  const avatar = product.user.avatar
    ? product.user.avatar
    : "/images/avatar.png";

  return (
    <div className="p-5 flex flex-col gap-1">
      <div className="relative border-neutral-700 bg-neutral-600 aspect-square border-4 rounded-md flex justify-center">
        <Image
          fill
          className="object-contain"
          src={`${product.photo}/public`}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex gap-3 items-center border-b border-neutral-50">
        <div className="size-10 rounded-full bg-neutral-700 overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="flex flex-auto items-start justify-between">
        <div className="p-3">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="whitespace-pre-line">{product.description}</p>
        </div>
        <div className="p-5 size-40">
          <LikeButton isLiked={isLiked} likeCount={likeCount} productId={id} />
        </div>
      </div>

      <div className=" p-2 bg-neutral-800 flex justify-between items-center">
        <div>
          <span className="font-semibold text-lg">
            CAD ${formatToDallar(product.price)}
          </span>
        </div>
        <div className="flex justify-end gap-2">
          {isOwner ? (
            <div className="flex justfy-center gap-2 items-end">
              <form action={onDelete}>
                <FormButton
                  text={"Delete"}
                  className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold text-center"
                />
              </form>
              <form action={onEdit}>
                <FormButton
                  text={"Edit"}
                  className=" bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold text-center"
                />
              </form>
            </div>
          ) : null}

          <form action={onCreateChatRoom}>
            <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold text-center">
              Start Chat
            </button>
          </form>
        </div>
      </div>
      <div className="p-5 flex flex-col pb-20">
        {product.posts.map((post) => (
          <PorductPost key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
