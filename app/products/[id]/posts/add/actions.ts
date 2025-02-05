"use server";
import db from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { postSchema } from "@/app/products/schema";
import { notFound, redirect } from "next/navigation";

export async function createPost(_: any, formData: FormData) {
  const session = await getSession();
  const productId = Number(formData.get("productId"));
  if (isNaN(productId)) {
    return notFound;
  }
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const results = await postSchema.safeParseAsync(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    await db.post.create({
      data: {
        title: results.data.title,
        description: results.data.description,
        userId: session.id!,
        productId: productId,
      },
      select: {
        id: true,
      },
    });
  }
  redirect(`/products/${productId}`);
  //return { productId: prevState.productId };
}
