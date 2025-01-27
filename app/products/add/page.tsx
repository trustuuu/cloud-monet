"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { PhotoIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import uploadProduct, { getUploadUrl } from "./action";
import { z } from "zod";
import { useFormState } from "react-dom";
import db from "@/app/lib/db";

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "Only image can be uploaded",
  }),
  size: z.number().max(1024 * 1024 * 10, {
    message: "maximum image size is less then 10MB.",
  }),
});

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUpLoadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const results = await fileSchema.safeParseAsync(file);
    if (!results.success) {
      alert(
        results.error.flatten().fieldErrors.type ||
          results.error.flatten().fieldErrors.size
      );
      return;
    }
    //make url in local
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    const { success, result } = await getUploadUrl();

    if (success) {
      const { id, uploadURL } = result;
      setUpLoadUrl(uploadURL);
      setImageId(id);
    }
  };

  const intercepAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudFlaraForm = new FormData();
    cloudFlaraForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudFlaraForm,
    });
    if (response.status !== 200) {
      return;
    }
    const photoUrl = `https://imagedelivery.net/Rb4GRCDlRSth88K5U-87QA/${imageId}`;
    formData.set("photo", photoUrl);

    return await uploadProduct(_, formData);
  };

  const [state, action] = useFormState(intercepAction, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
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
                Click to upload a picture errors={state?.fieldErrors.title}
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
        <Input
          name="title"
          required
          placeholder="Title"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="Price"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="Description"
          errors={state?.fieldErrors.description}
        />
        <Button text="Complete" />
      </form>
    </div>
  );
}
