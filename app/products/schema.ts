import { z } from "zod";

export const productSchema = z.object({
  id: z.coerce.number(),
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});

export type ProductType = z.infer<typeof productSchema>;

export const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "Only image can be uploaded",
  }),
  size: z.number().max(1024 * 1024 * 10, {
    message: "maximum image size is less then 10MB.",
  }),
});
