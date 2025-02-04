"use client";

import Button from "./button";
import Input from "./input";
import { PhotoIcon } from "@heroicons/react/20/solid";

import { useFormState } from "react-dom";
import { fileSchema } from "../products/schema";
import { EditProductType } from "../products/[id]/edit/page";
import { updateProduct } from "../products/[id]/edit/actions";
import { getUploadUrl } from "../add/products/action";
import { useState } from "react";

interface ProductProps {
  product: EditProductType;
}

export default function ProductEditForm({ product }: ProductProps) {
  const [preview, setPreview] = useState(`${product!.photo}/public`);
  const [uploadUrl, setUpLoadUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [imageChange, setImageChange] = useState(false);
  const oldPhotoID = product!.photo?.split("/").pop();

  const onPhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setImageChange(true);
    }
  };

  const intercepAction = async (prevState: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }

    if (imageChange) {
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
    } else {
      formData.set("photo", product!.photo);
    }

    const initialState = {
      photo: oldPhotoID + "",
      changed: imageChange,
      error: undefined,
    };
    return await updateProduct(initialState, formData);
  };

  const [state, action] = useFormState(intercepAction, null);

  return (
    <div>
      <form className="flex flex-col gap-4" action={action}>
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
                Click to upload a picture {state?.error?.formErrors}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onPhotoChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <div className="flex gap-2 flex-col">
          <Input
            hidden
            type="text"
            name="id"
            required
            defaultValue={product!.id}
          />
          <h1>Title</h1>
          <Input
            type="text"
            name="title"
            errors={state?.error?.formErrors}
            required
            defaultValue={product!.title}
          />
          <Input
            type="hidden"
            name="id"
            defaultValue={product!.id.toString()}
          />
        </div>
        <div className="flex gap-2 flex-col">
          <h1>Description</h1>
          {/* <Input
            type="text"
            name="description"
            errors={state?.fieldErrors?.description}
            required
            defaultValue={product!.description}
          /> */}
          <textarea
            id="text"
            name="description"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Description"
            defaultValue={product!.description}
          />
          <span className="text-red-500 font-medium">
            {state?.error?.formErrors}
          </span>

          {/* {state?.fieldErrors?.description!.map((error, index) => (
            <span className="text-red-500 font-medium" key={index}>
              {error}
            </span>
          ))} */}
          <h1>Price</h1>
          <Input
            name="price"
            type="number"
            required
            placeholder="Price"
            errors={state?.error?.formErrors}
            defaultValue={product!.price}
          />
        </div>
        <Button text="Save" />
      </form>
    </div>
  );
}
