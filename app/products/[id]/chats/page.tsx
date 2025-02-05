import { Prisma } from "@prisma/client";
import RoomList from "@/app/components/room-list";
import getSession from "@/app/lib/session";
import { getProductLite, getRoomsByProduct } from "../../productDML";

export type RoomListType = Prisma.PromiseReturnType<typeof getRoomsByProduct>;

export default async function ProductChats({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);
  const session = await getSession();
  const rooms = await getRoomsByProduct(productId);

  const product = await getProductLite(productId);
  const photo = product?.photo
    ? `${product?.photo}/public`
    : "/images/avatar.png";

  return (
    <div className="p-5 text-white">
      <label
        htmlFor="photo"
        className="w-full size-12 border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed bg-center bg-cover"
        style={{
          backgroundImage: `url(${photo})`,
        }}
      ></label>
      <RoomList rooms={rooms} userId={session.id!} />
    </div>
  );
}
