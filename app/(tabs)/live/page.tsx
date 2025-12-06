import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Live() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-neutral-700">
        <div className="text-center p-6 bg-neutral-500 rounded-lg shadow-lg max-w-sm mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-gray-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 4v4m0 0H4m12 0h4m-8 12V8m0 12l-4 4-4-4"
            ></path>
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            No Showcase Available
          </h2>
          <p className="text-gray-100 mt-2">
            It seems like there are no showcase at the moment. Please check back
            later.
          </p>

          <div className="mt-6">
            <Link
              href="/home"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <Link
        href="/streams/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
