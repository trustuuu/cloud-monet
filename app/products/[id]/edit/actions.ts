"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "../../schema";
import getSession from "@/app/lib/session";
import db from "@/app/lib/db";

export interface PhotoState {
  photo: string;
}

export async function updateProduct(prevState: PhotoState, formData: FormData) {
  const data = {
    id: formData.get("id"),
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (prevState.photo) {
    const responseDel = await delPhoto(prevState!.photo);
    console.log("responseDel", responseDel);
  }

  const results = await productSchema.safeParseAsync(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.update({
        where: {
          id: results.data.id,
        },
        data: {
          title: results.data.title,
          description: results.data.description,
          price: results.data.price,
          photo: results.data.photo,
        },
        select: {
          id: true,
        },
      });
      revalidateTag("product");
      revalidateTag("products");
      redirect(`/home`); ///${product.id}`);
    }
  }
}

export async function delPhoto(id: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  return response.json();
}
