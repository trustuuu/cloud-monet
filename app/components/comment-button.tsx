"use client";
import { useFormStatus } from "react-dom";

export default function CommentButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      name="comment-btn"
      className="flex items-center gap-2 text-white text-sm border
    rounded-full p-2 transition-colors bg-orange-500 border-orange-500"
    >
      {pending ? (
        <span className="loading loading-bars loading-sm"></span>
      ) : (
        <span>comment</span>
      )}
    </button>
  );
}
