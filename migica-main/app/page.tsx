"use client";

import { useState } from "react";
import { Mail, Check, Bell, X, Sparkles } from "lucide-react";
// Import HomeScreen for when they want to restore it later
// import HomeScreen from "./Pages/HomeScreen";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [showInput, setShowInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to subscribe. Please try again.");
      setStatus("error");
    }
  };


  return (
    <main className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#ffcf00] px-4 md:px-8 py-12 select-none">
      {/* Dynamic Warning/Construction Background Stripes */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div className="absolute w-[200%] h-1.5 bg-black -rotate-12 top-1/4 left-[-50%]" />
        <div className="absolute w-[200%] h-1 bg-white -rotate-12 top-1/3 left-[-50%]" />
        <div className="absolute w-[200%] h-2.5 bg-black -rotate-12 top-2/3 left-[-50%]" />
        <div className="absolute w-[200%] h-1 bg-white -rotate-12 top-[60%] left-[-50%]" />
        <div className="absolute w-[200%] h-2 bg-black -rotate-12 top-1/2 left-[-50%]" />
        <div className="absolute w-[200%] h-1 bg-white -rotate-12 top-[72%] left-[-50%]" />
      </div>

      {/* Floating subtle ambient particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-3 h-3 bg-white rounded-full top-[10%] left-[20%] animate-pulse" />
        <div className="absolute w-2.5 h-2.5 bg-black rounded-full top-[80%] left-[15%] opacity-20" />
        <div className="absolute w-4 h-4 bg-white rounded-full top-[40%] right-[10%] opacity-40 animate-bounce duration-1000" />
        <div className="absolute w-2 h-2 bg-black rounded-full top-[75%] right-[25%] opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full text-center">
        {/* Decorative badge */}
        <div className="inline-flex items-center gap-1.5 bg-black/10 backdrop-blur-sm text-zinc-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          Silver Star — Underway
        </div>

        {/* Skewed Banner Logo Group */}
        <div className="flex flex-col items-center mb-8 relative select-none">
          {/* Decorative lines around banner to match Freepik concept */}
          <div className="absolute -top-6 left-12 right-12 h-0.5 bg-black/20 transform -skew-x-12 -rotate-3" />
          <div className="absolute -bottom-6 left-8 right-8 h-0.5 bg-black/20 transform -skew-x-12 -rotate-3" />
          
          {/* Black Banner: COMING SOON */}
          <div className="bg-zinc-950 text-[#ffcf00] font-black uppercase text-3xl sm:text-4xl md:text-6xl lg:text-7xl px-8 sm:px-12 py-4 sm:py-5 shadow-[12px_12px_0px_rgba(0,0,0,0.15)] transform -skew-x-12 -rotate-3 transition-transform hover:scale-105 duration-300 relative z-10 leading-none tracking-tight">
            COMING SOON
          </div>
          
          {/* White Banner: UNDER CONSTRUCTION */}
          <div className="bg-white text-zinc-950 font-black uppercase text-lg sm:text-xl md:text-3xl lg:text-4xl px-6 sm:px-8 py-2.5 sm:py-3 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transform -skew-x-12 -rotate-3 -translate-y-2 sm:-translate-y-3 translate-x-4 sm:translate-x-6 transition-transform hover:scale-105 duration-300 relative z-20 leading-none tracking-wider">
            UNDER CONSTRUCTION
          </div>
        </div>

        {/* Informational Text */}
        <p className="text-zinc-900 font-medium text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-8 px-4 animate-fade-in duration-500">
          Our website is under construction, but we are ready to go! We are preparing something amazing and exciting for you. Special surprise for our subscribers only.
        </p>

        {/* Credit tag, subtle and stylish */}
        <span className="text-zinc-700/60 text-[10px] uppercase tracking-widest font-semibold mt-4 block">
          Image inspired by Freepik
        </span>

        {/* Interactive Subscription Component */}
        <div className="mt-12 w-full max-w-md px-4 min-h-[80px] flex items-center justify-center">
          {!showInput && status === "idle" && (
            <button
              onClick={() => setShowInput(true)}
              className="bg-white text-zinc-900 hover:bg-zinc-900 hover:text-white font-bold tracking-widest px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-xs sm:text-sm uppercase flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 animate-swing" />
              NOTIFY ME
            </button>
          )}

          {showInput && status !== "success" && (
            <form
              onSubmit={handleSubmit}
              className="w-full bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-2xl flex items-center border border-white/40 animate-scale-up"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "submitting"}
                className={`bg-transparent text-zinc-900 placeholder-zinc-500 font-medium px-4 py-3 flex-grow focus:outline-none text-xs sm:text-sm ${
                  status === "error" ? "text-red-500 placeholder-red-400" : ""
                }`}
                required
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-zinc-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors duration-200 text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {status === "submitting" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    SUBSCRIBE
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInput(false);
                  setStatus("idle");
                  setEmail("");
                }}
                className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}

          {status === "success" && (
            <div className="bg-zinc-900 text-white py-4 px-6 rounded-xl shadow-2xl flex items-center gap-3.5 font-bold text-xs sm:text-sm animate-scale-up border border-zinc-800">
              <div className="bg-[#ffcf00] p-1 rounded-full text-zinc-900">
                <Check className="w-4 h-4 stroke-[3px]" />
              </div>
              <span>Thank you! We will notify you when we go live.</span>
            </div>
          )}
        </div>
        
        {status === "error" && (
          <p className="text-red-700 text-xs font-semibold mt-2 animate-shake">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 relative z-10 text-[10px] text-zinc-700/60 font-semibold tracking-widest uppercase">
        © {new Date().getFullYear()} SILVER STAR. ALL RIGHTS RESERVED.
      </div>
    </main>
  );
}

