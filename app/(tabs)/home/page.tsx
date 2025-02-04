import Link from "next/link";

export default function TabHome() {
  return (
    <div
      className="flex flex-col items-center
    justify-between min-h-screen p-6"
    >
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">Monet</span>
        <h1 className="text-4xl">Cloud Monet</h1>
        <h2 className="text-2xl">Welcome to Cloud Monet!</h2>
      </div>
      {/* <div className="flex flex-col items-center gap-3">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          Gettiong Started!
        </Link>
        <div className="flex gap-2">
          <span>Do you have a account already?</span>
          <Link href="/login" className="hover:underline">
            Log In
          </Link>
        </div>
      </div> */}
    </div>
  );
}
