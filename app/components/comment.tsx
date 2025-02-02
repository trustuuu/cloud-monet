import { CommentProps, UserProps } from "./post";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as OutlineHandThumbUpIcon,
  HandThumbDownIcon as OutlineHandThumbDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { formatToTimeAgo } from "../lib/utils";
import { deleteComment } from "../products/productDML";
import { redirect } from "next/dist/server/api-utils";
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
  return (
    <div
      key={comment.id}
      className="w-4/5 flex flex-row justify-between mx-auto mt-2 py-1 border-b-2 border-neutral-50 border-dotted  "
    >
      <div className="flex items-center justify-start pl-4 mt-4 ">
        <div className=" text-neutral-100 text-lg font-semibold">
          {comment.payload}
        </div>
      </div>

      <div className="flex flex-col justify-end">
        <div className="flex flex-row gap-2 justify-end">
          {comment.owner.avatar ? (
            <Image
              className="rounded-full object-contain"
              src={`${comment.owner.avatar}/avatar`}
              alt={comment.owner.username}
              width={15}
              height={15}
            />
          ) : (
            <div className="rounded-full size-8 bg-slate-400"></div>
          )}
          <div>
            {comment.owner.username}{" "}
            {comment.userId === sessionId ? "(owner)" : ""}
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-end">
          <div className="text-xs text-neutral-500">
            {formatToTimeAgo(comment.created_at.toString())}
          </div>
          <div className="flex items-center gap-3 *:size-5 *:cursor-pointer">
            <TrashIcon onClick={() => onDelete(comment.id)} />
          </div>
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
