import ChatMessageList from "@/app/components/message-list";
import getSession from "@/app/lib/session";
import { getMessage, getRoom, getUser } from "@/app/products/productDML";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

export type initialMessagesType = Prisma.PromiseReturnType<typeof getMessage>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    notFound();
  }

  const initialMessages = await getMessage(params.id);
  const session = await getSession();
  const user = await getUser(session.id!);
  if (!user) {
    return notFound();
  }

  return (
    <ChatMessageList
      initialMessages={initialMessages}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      chatRoomId={params.id}
    />
  );
}
