"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBackend = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/backend-status");
      const data = (await response.json()) as { message: string };

      setMessage(data.message);
    } catch {
      setMessage("Failed to reach backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Frontend + Backend
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Connection check
        </h1>
        <p className="mt-4 text-base text-slate-300">
          Click the button to send a request from the frontend to the backend.
        </p>

        <button
          type="button"
          onClick={handleCheckBackend}
          disabled={isLoading}
          className="mt-8 rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          {isLoading ? "Loading..." : "Check backend"}
        </button>

        <div className="mt-6 min-h-16 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-lg">
          {message || "Response will appear here"}
        </div>
      </section>
    </main>
  );
}
