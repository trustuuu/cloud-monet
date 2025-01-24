import db from "@/app/lib/db";
import getSession, { setSession } from "@/app/lib/session";
import { AnyMxRecord } from "dns";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

const getAccessToken = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  return await accessTokenResponse.json();
};

const getGithubUser = async (access_token: string) => {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const data = await userProfileResponse.json();
  return data;
};

const getGithubUserPrimaryEmail = async (access_token: string) => {
  const userProfileResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    }
  );

  const emailData = await userProfileResponse.json();
  const primaryEmail = emailData.find(
    (item: { primary: true }) => item.primary
  )?.email;
  console.log("primaryEmail", primaryEmail);
  return primaryEmail;
};

const getUserFindUnique = async (whereArg: any, selectArg: any) => {
  const user = await db.user.findUnique({
    where: whereArg,
    select: selectArg,
  });
  return user;
};

const createUser = async (userData: any, selectArg: any) => {
  const newUser = await db.user.create({
    data: userData,
    select: selectArg,
  });
  return newUser;
};

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
  console.log("user", user);
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
  console.log("data", data);
  const newUser = await createUser(data, { id: true });
  console.log("newUser", newUser);
  await setSession(newUser.id);
  return redirect("/profile");
}
