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

export async function setSession(id) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
