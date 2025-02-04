"use client";
import { formatToTimeAgo } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { delRoom } from "../products/productDML";

interface RoomProps {
  id: string;
  created_at: Date;
  updated_at: Date;
  users: {
    id: number;
    avatar: string | null;
    username: string;
  }[];
}
export default function RoomComp({
  room,
  userId,
  removeRoom,
}: {
  room: RoomProps;
  userId: number;
  removeRoom: any;
}) {
  const removeChatRoom = async () => {
    await delRoom(room.id);
    removeRoom(room.id);
  };

  //const [state, actionRemove] = useFormState(removeChatRoom, null);
  const user = room.users.find((r) => r.id !== userId);

  return (
    <div
      key={room.id}
      className="flex mt-5 h-screen max-h-24 flex-rowmt-7 hover:cursor-pointer gap-2 justify-between transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 bg-neutral-400 p-2 border-dash rounded-md"
    >
      <div className="flex items-center gap-2 mb-2">
        {user ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={
              user?.avatar ??
              "https://avatars.githubusercontent.com/u/37176327?v=4"!
            }
            alt={user?.username}
          />
        ) : (
          <div className="size-7 bg-yellow-400 rounded-full"></div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{user?.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(room.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-end">
        <Link
          href={`/chats/${room.id}`}
          className="flex items-center gap-2 text-white text-sm border
                          rounded-full p-2 bg-orange-500 border-orange-500 hover:scale-110"
        >
          Enter
        </Link>
        <form action={removeChatRoom}>
          <button
            name="enter-btn"
            className="flex items-center gap-2 text-white text-sm border
                          rounded-full p-2 bg-orange-500 border-orange-500 hover:scale-110"
          >
            Remove
          </button>
        </form>
      </div>
    </div>
  );
}
