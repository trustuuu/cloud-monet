import { IsOwner } from "@/app/lib/session";
import { ChevronDoubleLeftIcon, UserIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { formatToDallar } from "@/app/lib/utils";
import FormButton from "@/app/components/button";
import { delProduct, getProduct } from "../productDML";
import { Console } from "console";
import { revalidateTag } from "next/cache";

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

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await IsOwner(product.userId);

  const onDelete = async () => {
    "use server";
    await delProduct(id);
    revalidateTag("product");
    revalidateTag("products");
    redirect("/home");
  };

  const onEdit = async () => {
    "use server";
    revalidateTag("product");
    revalidateTag("products");
    redirect(`/products/${id}/edit`);
  };

  return (
    <div className="p-5 flex flex-col gap-5">
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
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
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

          <Link
            className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold text-center"
            href={``}
          >
            Start Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
