"use server";

import db from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { delProduct } from "../productDML";
import { redirect } from "next/navigation";
import { productSchema } from "../schema";
import { ProductProps } from "@/app/components/product";
