import getSession from "../../lib/session";
import db from "../../lib/db";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: { id: session.id },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function UserName() {
  const user = await getUser();
  return <h1>Welcome! {user?.username}!</h1>;
}

export default async function profile() {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <Suspense fallback="Welcome to Cloud Monet">
        <UserName />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}
