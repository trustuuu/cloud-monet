"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "../../schema";
import getSession from "@/app/lib/session";
import db from "@/app/lib/db";

export interface PhotoState {
  photo: string;
  changed: boolean;
}

export async function updateProduct(prevState: PhotoState, formData: FormData) {
  const id = Number(formData.get("id"));
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const results = await productSchema.safeParseAsync(data);
  if (!results.success) {
    console.log(
      "Photo Edit results.error.flatten()",
      results.error.flatten(),
      data
    );
    return {
      photo: formData.get("photo"),
      changed: prevState.changed,
      error: results.error.flatten(),
    };
  } else {
    if (prevState.photo && prevState.changed) {
      const responseDel = await delPhoto(prevState!.photo);
    }

    const session = await getSession();
    if (session.id) {
      const product = await db.product.update({
        where: {
          id: id,
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

      revalidateTag("product-detail");
      revalidateTag("products");
      redirect(`/home`);
      //return product;
      //return { photo: "", changed: false };
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
