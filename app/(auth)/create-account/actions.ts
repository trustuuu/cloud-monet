"use server";
import { z } from "zod";
import bcrypt from "bcrypt";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "../../lib/constants";
import db from "../../lib/db";
import { redirect } from "next/navigation";
import { setSession } from "../../lib/session";

// const checkUsernameExists = async (username: string) => {
//   const user = await db.user.findUnique({
//     where: { username: username },
//     select: { id: true },
//   });
//   return !Boolean(user);
// };

// const checkEmailExist = async (email: string) => {
//   const userEmail = await db.user.findUnique({
//     where: { email: email },
//     select: { id: true },
//   });
//   return !Boolean(userEmail);
// };

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string",
        required_error: "Username is required.",
      })
      .min(PASSWORD_MIN_LENGTH, "too short")
      .max(20, "too long")
      .toLowerCase()
      .trim()
      //.transform(username => `${username}-test`)
      .refine(
        (username) => !username.includes("#"),
        "no special character allowed"
      ),
    //.refine(checkUsernameExists, "username already exists!"),
    email: z.string().email().trim().toLowerCase(),
    //.refine(checkEmailExist, "Email is registered already!"),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username: username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "username already exists!",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email: email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "email already exists!",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "password mismatched!",
    path: ["confirmPassword"],
  });

export async function createAccount(_: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const results = await formSchema.safeParseAsync(data);

  if (!results.success) {
    return results.error.flatten();
  } else {
    const hashedPW = await bcrypt.hash(results.data.password, 12);
    const user = await db.user.create({
      data: {
        username: results.data.username,
        email: results.data.email,
        password: hashedPW,
      },
      select: {
        id: true,
      },
    });
    await setSession(user.id);
    // const session = await getSession();
    // session.id = user.id;
    // await session.save();
    redirect("/profile");
  }
}
