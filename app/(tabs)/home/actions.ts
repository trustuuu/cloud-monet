"use server";
import db from "@/app/lib/db";

export async function getMoreProduct(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
      _count: {
        select: {
          likes: true,
        },
      },
      // posts: {
      //   select: {
      //     id: true,
      //     title: true,
      //     description: true,
      //     views: true,
      //     created_at: true,
      //     _count: {
      //       select: {
      //         comments: true,
      //       },
      //     },
      //   },
      // },
    },
    orderBy: {
      created_at: "desc",
    },
    skip: page * 1,
    take: 1,
  });

  return products;
}
