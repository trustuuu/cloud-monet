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

export const getUserFindUnique = async (whereArg: any, selectArg: any) => {
  const user = await db.user.findUnique({
    where: whereArg,
    select: selectArg,
  });
  return user;
};

export const createUser = async (userData: any, selectArg: any) => {
  const newUser = await db.user.create({
    data: userData,
    select: selectArg,
  });
  return newUser;
};
