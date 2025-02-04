import ButtonClose from "@/app/components/buttonClose";
import db from "@/app/lib/db";
import { formatToDallar } from "@/app/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
async function getProduct(id: number) {
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
export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    // if (params.id === "add") {
    //   return redirect("/products/add");
    // }
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const avatar = product.user.avatar
    ? `${product.user.avatar}/avatar`
    : "/images/avatar.png";
  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full h-auto p-6">
        <ButtonClose />
        <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
          See more..
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 h-60 md:h-80 relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              fill
              src={`${product.photo}/public`}
              alt={product.title}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {product.title}
              </h2>
              <p className="text-sm font-medium text-gray-700">
                CAD ${formatToDallar(product.price)}
              </p>
              <p className="text-neutral-500 whitespace-pre-line">
                {product.description}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200">
                <Image
                  fill
                  src={avatar}
                  alt={product.user.username}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-800">
                {product.user.username}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
