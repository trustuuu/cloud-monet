import ProductList from "@/app/components/product-list";
import { getMoreProduct } from "@/app/products/productDML";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Prisma } from "@prisma/client";
//import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

// const getCachedProducts = nextCache(getProducts, ["products"], {
//   tags: ["products"],
// });
//const getCachedProducts = nextCache(getProducts, ["home-products"], {revalidate: 60});

export type Products = Prisma.PromiseReturnType<typeof getMoreProduct>;

export const metadata = {
  title: "Home",
};

//export const dynamic = "force-dynamic";
//export const revalidate = 60;

export default async function Products() {
  //const initialProducts = await getProducts();
  const initialProducts = await getMoreProduct(0, 5); //getProductsWithPage(5);

  // const revalidate = async () => {
  //   "use server";
  //   revalidatePath("/products");
  // };
  return (
    <div className="p-5 flex flex-col gap-5">
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/add/products"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10 " />
      </Link>
    </div>
  );
}

//only static page will be rendered. it doesn't create static page for new record
//export const dynamicParams = false;

// export async function generateStaticParams() {
//   const products = await db.product.findMany({
//     select: {
//       id: true,
//     },
//   });
//   return products.map((product) => ({ id: product.id + "" }));
//}
