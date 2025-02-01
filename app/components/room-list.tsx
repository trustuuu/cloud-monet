"use client";
import { formatToTimeAgo } from "@/app/lib/utils";
import { actionAsyncStorage } from "next/dist/client/components/action-async-storage-instance";
import Image from "next/image";
import { useFormState } from "react-dom";
import { RoomListType } from "../(tabs)/chats/page";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import RoomComp from "./room";
import { useState } from "react";

interface RoomsTypeProps {
  rooms: RoomListType;
  userId: number;
}
export default function RoomList({ rooms, userId }: RoomsTypeProps) {
  const [allRooms, setAllRooms] = useState(rooms);
  const removeRoom = (id: string) => {
    console.log("removeRoom", id);
    setAllRooms(rooms.filter((r) => r.id !== id));
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <span>Total Room: {allRooms.length}</span>
      {allRooms.map((room) => (
        <RoomComp
          key={room.id}
          room={room}
          userId={userId}
          removeRoom={removeRoom}
        />
      ))}
    </div>
  );
}
