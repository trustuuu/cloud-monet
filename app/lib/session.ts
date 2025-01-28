import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}
export default async function getSession() {
  return await getIronSession<SessionContent>(cookies(), {
    cookieName: process.env.COOKIE_NAME!,
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function setSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

export async function IsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}
