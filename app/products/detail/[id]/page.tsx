"use server";

import { notFound, redirect } from "next/navigation";

export default async function ProductRedirectToDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return notFound();
  }

  redirect(`/products/${id}`);
}
