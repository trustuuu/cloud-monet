"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { PhotoIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import uploadProduct from "./action";
import { z } from "zod";

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "Only image can be uploaded",
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: "maximum image size is less then 2MB.",
  }),
});

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const result = fileSchema.safeParse(file);
    if (!result.success) {
      alert(
        result.error.flatten().fieldErrors.type ||
          result.error.flatten().fieldErrors.size
      );
      return;
    }
    //make url in local
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  return (
    <div>
      <form action={uploadProduct} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer  bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                Click to upload a picture
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input name="title" required placeholder="Title" type="text" />
        <Input name="price" type="number" required placeholder="Price" />
        <Input
          name="description"
          type="text"
          required
          placeholder="Description"
        />
        <Button text="Complete" />
      </form>
    </div>
  );
}
