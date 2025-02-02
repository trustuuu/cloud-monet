import Link from "next/link";
import { formatToTimeAgo } from "../lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import CommentComp from "./comment";
import Image from "next/image";
import CommentList from "./comment-list";
import getSession from "../lib/session";
import { getMaxCommentId, getUser } from "../products/productDML";

export interface UserProps {
  avatar: string | null;
  username: string;
}
export interface CommentProps {
  id: number;
  payload: string;
  created_at: Date;
  userId: number;
  owner: UserProps;
  postId: number;
}

export interface PostProps {
  id: number;
  title: string;
  description: string | null;
  created_at: Date;
  views: number;
  owner: UserProps;
  comments: CommentProps[];
  _count: { comments: number };
}

export default async function PorductPost({
  id,
  title,
  description,
  created_at,
  views,
  owner,
  comments,
  _count,
}: PostProps) {
  const session = await getSession();
  const user = await getUser(session.id!);

  return (
    <div className="p-5 text-white">
      <Link
        key={id}
        href={`/posts/${id}`}
        className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0"
      >
        <div className="flex items-center gap-2 mb-2">
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={owner.avatar!}
            alt={owner.username}
          />
          <div>
            <span className="text-sm font-semibold">{owner.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="text-white text-lg font-semibold">{title}</h2>
        <p>{description}</p>
      </Link>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(created_at.toString())}</span>
          <span>·</span>
          <span>view {views}</span>
          {/* <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} /> */}
        </div>
        <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
          <span>
            <ChatBubbleBottomCenterIcon className="size-4" />
            {_count.comments}
          </span>
        </div>
      </div>
      <CommentList
        sessionId={session.id!}
        postId={id}
        user={user!}
        comments={comments}
      />
    </div>
  );
}
