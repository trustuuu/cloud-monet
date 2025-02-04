import { notFound } from "next/navigation";
import { getProduct } from "../../productDML";
import { IsOwner } from "@/app/lib/session";
import ProductEditForm from "@/app/components/product-edit-form";
import { Prisma } from "@prisma/client";

export type EditProductType = Prisma.PromiseReturnType<typeof getProduct>;

export default async function EditPost({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    notFound();
  }

  const isOwner = await IsOwner(id);
  if (!isOwner) {
    notFound();
  }

  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  return (
    <>
      <div className="p-5">
        {/* <BeforePage /> */}
        <ProductEditForm product={product!} />
      </div>
    </>
  );
}
