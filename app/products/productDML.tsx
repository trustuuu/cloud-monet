"use server";

import db from "../lib/db";

export async function getProduct(id: number) {
  //await new Promise((resolve) => setTimeout(resolve, 5000));
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export const delProduct = async (id: number) => {
  await db.product.delete({
    where: {
      id,
    },
  });
};
