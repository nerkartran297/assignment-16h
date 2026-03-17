import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-[85vh]">
      <h1 className="text-2xl font-bold">Coming Soon</h1>
      <p className="text-gray-500">This page is not available yet.</p>
      <Link href="/" className="text-blue-500">
        Go back to the home page
      </Link>
    </div>
  );
}
