import getSession from "../../lib/session";
import db from "../../lib/db";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

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

export default async function profile() {
  const user = await getUser();
  async function UserName() {
    //const user = await getUser();
    return <h1 className="text-3xl font-semibold">{user?.username}</h1>;
  }
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <div className="rounded-lg mt-6">
        <header className="text-center mb-6">
          {/* <Image
            src="profile-picture.jpg"
            alt="Profile Picture"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          /> */}
          <Image
            className="w-32 h-32 rounded-full mx-auto mb-4"
            src={
              user.avatar ??
              "https://avatars.githubusercontent.com/u/37176327?v=4"!
            }
            alt={user.username}
            width={50}
            height={50}
          />
          <Suspense fallback="Welcome to Cloud Monet">
            <UserName />
          </Suspense>
          <p className="text-xl text-gray-600">
            Graphic Designer & Illustrator
          </p>
        </header>

        {/* <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">My Work</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <Image
                src="project1.jpg"
                alt="Project 1"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src="project2.jpg"
                alt="Project 2"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src="project3.jpg"
                alt="Project 3"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src="project4.jpg"
                alt="Project 4"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </section> */}

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About Me</h2>
          <p>
            With over 8 years of experience in graphic design, I specialize in
            branding, illustration, and visual storytelling. I strive to create
            designs that not only look amazing but also communicate a message
            clearly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Adobe Photoshop & Illustrator</li>
            <li>UI/UX Design</li>
            <li>Logo Design</li>
            <li>Typography</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>Email: {user.email}</p>
          <div className="flex flex-col gap-2">
            <a
              href="https://instagram.com/james.chang"
              className="text-pink-500 hover:text-pink-700"
            >
              Instagram
            </a>

            <a
              href="https://dribbble.com/james.chang"
              className="text-pink-500 hover:text-pink-700"
            >
              Dribbble
            </a>
          </div>
        </section>
      </div>
      <div className="flex justify-center items-center mt-10">
        <form action={logOut}>
          <button>Log out</button>
        </form>
      </div>
    </div>
  );
}
