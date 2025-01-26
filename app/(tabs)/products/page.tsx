import ProductList from "@/app/components/product-list";
import db from "@/app/lib/db";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getProducts() {
  //await new Promise((resolve) => setTimeout(resolve, 100000));
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 1,
  });
  return products;
}

export type Products = Prisma.PromiseReturnType<typeof getProducts>;

export default async function Products() {
  const initialProducts = await getProducts();
  return (
    <div className="p-5 flex flex-col gap-5">
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10 " />
      </Link>
    </div>
  );
}
