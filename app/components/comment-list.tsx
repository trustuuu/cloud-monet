"use client";
import Link from "next/link";
import CommentComp from "./comment";
import { CommentProps, UserProps } from "./post";
import CommentButton from "./comment-button";
import { Suspense, useOptimistic, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { addComment } from "../products/productDML";

export default function CommentList({
  sessionId,
  postId,
  commentMax,
  comments,
  user,
}: {
  sessionId: number;
  postId: number;
  commentMax: number;
  comments: CommentProps[];
  user: UserProps;
}) {
  const [commentId, setCommentId] = useState(commentMax);
  const [isPending, startTransition] = useTransition();
  const [allComments, setAllComments] = useState(comments);

  const [finalComments, reducerFn] = useOptimistic(
    comments,
    (prevState, newComment: CommentProps) => {
      //console.log("prevState", prevState);
      return [...prevState, newComment];
    }
  );

  const interceptAction = (_: any, formData: FormData) => {
    const payload = formData.get("new_payload")?.toString()!;
    const newComment = {
      payload,
      id: commentId + 1,
      postId,
      created_at: new Date(),
      userId: sessionId,
      owner: user,
    };

    setCommentId(commentId + 1);
    setAllComments((prevComments) => [...prevComments, newComment]);
    formData.set("new_payload", "");
    //startTransition(() => {
    //reducerFn(newComment);
    //});
    //return addComment(_, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <>
      <div className="flex flex-col gap-2 items-center *:gap-1 *:items-center">
        <Suspense fallback={<div>loading...</div>}>
          {allComments
            ? allComments.map((comment) => (
                <CommentComp
                  key={comment.id}
                  sessionId={sessionId!}
                  comment={comment}
                />
              ))
            : null}
        </Suspense>
      </div>
      <div className="w-full flex p-5 -1 justify-start">
        <form action={action} className="w-full flex flex-row gap-1">
          <textarea
            id="text"
            name="new_payload"
            rows={1}
            className="w-5/6 block pl-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="write comments"
          />
          {/* <input className="bg-black" name="postId" defaultValue={commentId} /> */}
          <input className="hidden" name="postId" defaultValue={postId} />
          <input className="hidden" name="userId" defaultValue={sessionId} />

          <CommentButton />
        </form>
        {/* <button onClick={onClick}>TEST</button> */}
      </div>
    </>
  );
}
