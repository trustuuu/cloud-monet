"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { startTransition, useOptimistic } from "react";
import { dislikePost, likePost } from "../products/productDML";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  productId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  productId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async () => {
    startTransition(async () => {
      //undefined is payload parameter. we don't need this value at this time. thus nudefined passed.
      reducerFn(undefined);
      if (isLiked) {
        await dislikePost(productId);
      } else {
        await likePost(productId);
      }
    });
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-800"
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>Like ({state.likeCount})</span>
      )}
    </button>
  );
}
