"use client";
import {
  PhotoIcon as SolidPhotoIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  //   VideoCameraIcon as SolidVideoCameraIcon,
  //   UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  PhotoIcon as OutlinePhotoIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  //   VideoCameraIcon as OutlineVideoCameraIcon,
  //   UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProductTabBar() {
  const pathname = usePathname().split("/");
  //const firstNode = pathname[1];
  const productId = pathname[2];
  const pageNode = pathname[3];

  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-4 border-neutral-600 border-t px-5 py-3 *:text-green-300 bg-neutral-800">
      <Link href={`/home`} className="flex flex-col items-center gap-px">
        <OutlineHomeIcon className="w-7 h-7" />
        <span>Home</span>
      </Link>
      <Link
        href={`/products/${productId}`}
        className="flex flex-col items-center gap-px"
      >
        {pathname.length === 3 ? (
          <SolidPhotoIcon className="w-7 h-7" />
        ) : (
          <OutlinePhotoIcon className="w-7 h-7" />
        )}
        <span>Product</span>
      </Link>
      <Link
        href={`/products/${productId}/posts`}
        className="flex flex-col items-center gap-px"
      >
        {pageNode === "posts" ? (
          <SolidNewspaperIcon className="w-7 h-7" />
        ) : (
          <OutlineNewspaperIcon className="w-7 h-7" />
        )}
        <span>posts</span>
      </Link>
      <Link
        href={`/products/${productId}/chats`}
        className="flex flex-col items-center gap-px"
      >
        {pageNode === "chats" ? (
          <SolidChatIcon className="w-7 h-7" />
        ) : (
          <OutlineChatIcon className="w-7 h-7" />
        )}
        <span>Chat</span>
      </Link>
      {/* <Link href="/live" className="flex flex-col items-center gap-px">
        {pageNode === "live" ? (
          <SolidVideoCameraIcon className="w-7 h-7" />
        ) : (
          <OutlineVideoCameraIcon className="w-7 h-7" />
        )}
        <span>Showcase</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pageNode === "/profile" ? (
          <SolidUserIcon className="w-7 h-7" />
        ) : (
          <OutlineUserIcon className="w-7 h-7" />
        )}
        <span>Profile</span>
      </Link> */}
    </div>
  );
}
