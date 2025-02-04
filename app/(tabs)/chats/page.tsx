import RoomList from "@/app/components/room-list";
import getSession from "@/app/lib/session";
import { getRooms } from "@/app/products/productDML";
import { Prisma } from "@prisma/client";

export type RoomListType = Prisma.PromiseReturnType<typeof getRooms>;

export default async function Chats() {
  const session = await getSession();
  const rooms = await getRooms(session.id!);

  return <RoomList rooms={rooms} userId={session.id!} />;
}
