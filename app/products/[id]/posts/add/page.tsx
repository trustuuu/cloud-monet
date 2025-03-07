"use client";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useFormState } from "react-dom";
import { createPost } from "./actions";

export default function AddPost({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { photo: string };
}) {
  const id = params.id;
  const photo = searchParams.photo;

  const [state, action] = useFormState(createPost, null);
  if (!state) let voidAction = state;

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer  bg-center bg-cover"
          style={{
            backgroundImage: `url(${photo}/public)`,
          }}
        ></label>
        <input
          id="productId"
          name="productId"
          defaultValue={id}
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="Title"
          type="text"
          //errors={state?.fieldErrors.title}
        />
        <textarea
          id="text"
          name="description"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Description"
        />
        {/* {state?.fieldErrors?.description!.map((error, index) => (
          <span className="text-red-500 font-medium" key={index}>
            {error}
          </span>
        ))} */}
        <Button text="Complete" />
      </form>
    </div>
  );
}
