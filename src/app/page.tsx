import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Gym Tracker</h1>
      <p>Track your progress and routines</p>
      <div className="mt-4 space-x-4">
        <Link href="/workout" className="underline text-blue-500">
          Go to Workout
        </Link>
        <Link href="/routine" className="underline text-blue-500">
          Go to Routine
        </Link>
      </div>
    </main>
  );
}
