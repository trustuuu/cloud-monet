import { setSession } from "@/app/lib/session";

import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import {
  createUser,
  getAccessToken,
  getGithubUser,
  getGithubUserPrimaryEmail,
  getUserFindUnique,
} from "../oauth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }

  const { error, access_token } = await getAccessToken(code);
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login } = await getGithubUser(access_token);
  const gitHubEmail = await getGithubUserPrimaryEmail(access_token);

  const user = await getUserFindUnique({ github_id: id + "" }, { id: true });

  if (user) {
    await setSession(user.id);
    return redirect("/profile");
  }

  const userByEmail = await getUserFindUnique(
    { email: gitHubEmail + "" },
    { id: true }
  );

  const data = {
    username: login,
    email: userByEmail ? `${gitHubEmail}-${id}` : gitHubEmail,
    github_id: id + "",
    avatar: avatar_url,
  };

  const newUser = await createUser(data, { id: true });

  await setSession(newUser.id);
  return redirect("/profile");
}
