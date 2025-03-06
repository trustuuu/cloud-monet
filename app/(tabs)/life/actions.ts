"use server";
import db from "@/app/lib/db";

// export async function getMoreProduct(page: number, itemCount: number) {
//   const products = await db.product.findMany({
//     select: {
//       title: true,
//       price: true,
//       created_at: true,
//       photo: true,
//       id: true,
//       _count: {
//         select: {
//           likes: true,
//         },
//       },
//     },
//     orderBy: {
//       created_at: "desc",
//     },
//     skip: page * 5,
//     take: itemCount,
//   });

//   return products;
// }
