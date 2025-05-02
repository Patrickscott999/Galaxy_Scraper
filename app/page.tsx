import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Welcome to Your React App
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          A complete application with authentication and payment processing capabilities
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
