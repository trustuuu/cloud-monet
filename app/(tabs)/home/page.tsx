import Image from "next/image";

export default function TabHome() {
  return (
    <div
      className="flex flex-col items-center
    justify-between min-h-screen p-6"
    >
      <div className="my-auto flex flex-col items-center justify-center gap-2 *:font-medium">
        <span className="text-7xl text-center">Cloud Monet</span>
        <Image
          src="https://imagedelivery.net/Rb4GRCDlRSth88K5U-87QA/0138def8-3919-4c3c-c6f8-a739cbf03700/public"
          alt="Monet"
          width={500} // specify the width
          height={300} // specify the height
          className="rounded-lg" // optional for rounded corners
        />
        <h1 className="text-4xl text-center">Art Marketplace Platform</h1>
        <h4 className="text-neutral-400 w-80">
          Welcome to Cloud Monet! Cloud Monet is a platform that introduces
          artists paintings to the public, making them easily accessible. All
          proceeds go towards supporting the artists creative activities.
        </h4>
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
