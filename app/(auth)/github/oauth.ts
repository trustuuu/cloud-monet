import db from "../../lib/db";

export const getAccessToken = async (code: string) => {
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

export const getGithubUser = async (access_token: string) => {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const data = await userProfileResponse.json();
  return data;
};

export const getGithubUserPrimaryEmail = async (access_token: string) => {
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

  return primaryEmail;
};

export const getUserFindUniqueById = async (id: number) => {
  const user = await db.user.findUnique({
    where: { id: id },
    select: { id: true },
  });
  return user;
};

export const getUserFindUniqueByGitHubId = async (githubId: number) => {
  const user = await db.user.findUnique({
    where: { github_id: githubId.toString() },
    select: { id: true },
  });
  return user;
};

export const getUserFindUniqueByEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email: email },
    select: { id: true },
  });
  return user;
};

export const createUser = async (userData: any) => {
  const newUser = await db.user.create({
    data: userData,
    select: { id: true },
  });
  return newUser;
};
