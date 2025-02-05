"use client";
import CommentComp from "./comment";
import { CommentProps, UserProps } from "./post";
import CommentButton from "./comment-button";
import {
  Suspense,
  useRef,
  useOptimistic,
  useState,
  startTransition,
} from "react";
import { useFormState } from "react-dom";
import { addComment, deleteComment } from "../products/productDML";

export type OnDeleteType = (id: number) => void;

export default function CommentList({
  sessionId,
  postId,
  comments,
  user,
}: {
  sessionId: number;
  postId: number;
  comments: CommentProps[];
  user: UserProps;
}) {
  //const [commentId, setCommentId] = useState(commentMax);
  const [allComments, setAllComments] = useState(comments);
  const payLoadRef = useRef<HTMLTextAreaElement>(null);

  type Action =
    | { type: "add"; item: CommentProps }
    | { type: "delete"; id: number };

  const [finalComments, reducerFn] = useOptimistic(
    allComments,
    (prevState, action: Action) => {
      switch (action.type) {
        case "add":
          if (payLoadRef.current) {
            payLoadRef.current.value = "";
          }
          return [...prevState, action.item];
        case "delete":
          return prevState.filter((item) => item.id !== action.id);
        default:
          return prevState;
      }
    }
  );

  const interceptAction = async (_: any, formData: FormData) => {
    const payload = (formData.get("new_payload") ?? "").toString()!;
    const newComment = {
      payload,
      id: new Date().getMilliseconds(),
      postId,
      created_at: new Date(),
      userId: sessionId,
      owner: user,
    };

    reducerFn({ type: "add", item: newComment });
    const newCommentDB = await addComment(_, formData);
    setAllComments((prevComments) => [...prevComments, newCommentDB]);
  };

  const [state, action] = useFormState(interceptAction, null);
  if (!state) {
    console.log(state);
  }

  const onDeleteComment: OnDeleteType = async (id) => {
    startTransition(async () => {
      reducerFn({ type: "delete", id: id });
      await deleteComment(id);
      setAllComments(allComments.filter((comment) => comment.id != id));
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-center *:gap-1 *:items-center">
        <Suspense fallback={<div>loading...</div>}>
          {finalComments
            ? finalComments.map((comment) => (
                <CommentComp
                  key={comment.id}
                  sessionId={sessionId!}
                  comment={comment}
                  onDelete={onDeleteComment}
                />
              ))
            : null}
        </Suspense>
      </div>
      <div className="w-full flex pt-2 justify-start">
        <form action={action} className="w-full flex flex-row gap-1">
          <textarea
            id="text"
            name="new_payload"
            rows={1}
            className="w-5/6 block pl-1 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="write comments"
            ref={payLoadRef}
          />
          {/* <input className="bg-black" name="postId" defaultValue={commentId} /> */}
          <input className="hidden" name="postId" defaultValue={postId} />
          <input className="hidden" name="userId" defaultValue={sessionId} />

          <CommentButton />
        </form>
      </div>
    </>
  );
}
