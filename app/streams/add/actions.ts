"use server";

import db from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { createStream } from "@/app/products/productDML";
import { redirect } from "next/navigation";
import { z } from "zod";

const title = z.string();

export async function startStream(_: any, formData: FormData) {
  const results = title.safeParse(formData.get("title"));
  if (!(await results).success) {
    return (await results).error?.flatten();
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        meta: {
          name: results.data,
        },
        recording: {
          mode: "automatic",
        },
      }),
    }
  );
  const data = await response.json();
  const session = await getSession();
  const streamData = {
    title: results.data!,
    stream_id: data.result.uid,
    stream_key: data.result.rtmps.streamKey,
    userId: session.id!,
  };
  const stream = await createStream(streamData);

  redirect(`/streams/${stream.id}`);
}
