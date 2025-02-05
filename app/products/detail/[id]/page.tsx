import { notFound, redirect } from "next/navigation";

export default async function ProductRedirectToDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  redirect(`/products/${id}`);

  return <></>;
}
