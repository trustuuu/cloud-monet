import { CommentProps } from "./post";
import {
  // HandThumbUpIcon as OutlineHandThumbUpIcon,
  // HandThumbDownIcon as OutlineHandThumbDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { formatToTimeAgo } from "../lib/utils";

import { OnDeleteType } from "./comment-list";

export default function CommentComp({
  sessionId,
  comment,
  onDelete,
}: {
  sessionId: number;
  comment: CommentProps;
  onDelete: OnDeleteType;
}) {
  const avatar = comment.owner.avatar
    ? `${comment.owner.avatar}/avatar`
    : "https://imagedelivery.net/Rb4GRCDlRSth88K5U-87QA/d3e4f427-6e74-4ce9-3b48-a74ac6b9c600/public";

  return (
    <div
      key={comment.id}
      className="w-full flex flex-row justify-between mx-auto mt-2 py-1 border-b-2 border-neutral-50 border-dotted  "
    >
      <div className="flex items-center justify-start pl-4 mt-4 ">
        <div className=" text-neutral-100 text-lg font-thin">
          {comment.payload}
        </div>
      </div>

      <div className="flex flex-col justify-end *:font-thin">
        <div className="flex flex-row gap-2 justify-end">
          {/* {comment.owner.avatar ? ( */}
          <Image
            className="rounded-full object-contain"
            src={avatar}
            alt={comment.owner.username}
            width={15}
            height={15}
          />
          {/* ) : (
            <div className="rounded-full size-8 bg-slate-400"></div>
          )} */}
          <div>{comment.owner.username} </div>
        </div>
        <div className="flex flex-row gap-2 justify-end">
          <div className="text-xs text-neutral-500">
            {formatToTimeAgo(comment.created_at.toString())}
          </div>
          {comment.userId === sessionId ? (
            <div className="flex items-center gap-3 *:size-5 *:cursor-pointer">
              <TrashIcon onClick={() => onDelete(comment.id)} />
            </div>
          ) : null}
        </div>
        {/* <div>
          {userId === session.id ? (
            <EllipsisVerticalIcon className="size-5" />
          ) : null}
        </div> */}
      </div>
      {/* <div className="flex items-center justify-between pl-4 mt-4">
        <div className="flex items-center gap-3 *:size-5 *:cursor-pointer">
          <OutlineHandThumbUpIcon />
          <OutlineHandThumbDownIcon />
        </div>
      </div> */}
    </div>
  );
}
