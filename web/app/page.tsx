import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
      </div>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] relative z-10 px-4 pt-24">
        <h1 className="text-5xl md:text-7xl font-bold text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent drop-shadow-sm">
          File Cloud Lab
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl text-center">
          Full-stack demo: JWT auth, files, Stripe, RBAC — wired to the Nest API.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/25"
          >
            Get started
          </Link>
        </div>
      </main>
    </div>
  );
}
