"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/app/lib/db";
import getSession, { setSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { get } from "http";
import { env } from "process";
import { POST } from "@/app/api/users/route";

const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});

export default async function uploadProduct(
  prevState: any,
  formData: FormData
) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const results = await productSchema.safeParseAsync(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: results.data.title,
          description: results.data.description,
          price: results.data.price,
          photo: results.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
    }
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
