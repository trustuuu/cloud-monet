import { setSession } from "@/app/lib/session";

import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import {
  createUser,
  getAccessToken,
  getGithubUser,
  getGithubUserPrimaryEmail,
  getUserFindUniqueByEmail,
  getUserFindUniqueByGitHubId,
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

  const user = await getUserFindUniqueByGitHubId(id);

  if (user) {
    await setSession(user.id);
    return redirect("/profile");
  }

  const userByEmail = await getUserFindUniqueByEmail(gitHubEmail);

  const data = {
    username: login,
    email: userByEmail ? `${gitHubEmail}-${id}` : gitHubEmail,
    github_id: id + "",
    avatar: avatar_url,
  };

  const newUser = await createUser(data);
  await setSession(newUser.id);
  return redirect("/profile");
}
