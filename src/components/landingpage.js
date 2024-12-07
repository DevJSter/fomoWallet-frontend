import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import About from "./about";
import PlayGame from "./playgame";

const Navbar = () => {
  return (
    <nav className="px-4 py-6 relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" className="h-12" alt="Logo" />
          <p className="font-semibold text-3xl">Fomo Wallet</p>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/create-bet"
            className="text-black font-semibold hover:underline cursor-pointer transition-all duration-200 hover:text-purple-600"
          >
            Create Bet
          </Link>
          <Button
            onClick={() => {
              console.log("Connecting wallet...");
            }}
            className="border-black bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors duration-200"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <main className="relative">
      {/* Background grid layers */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30 blur-sm"
          style={{
            backgroundSize: "100px 100px",
            backgroundImage: `
              linear-gradient(to right, #BE9911 1px, transparent 1px),
              linear-gradient(to bottom, #BE9911 1px, transparent 1px)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundSize: "100px 100px",
            filter: "blur(0.5px)",
            backgroundImage: `
              linear-gradient(to right, #BE9911 1px, transparent 1px),
              linear-gradient(to bottom, #BE9911 1px, transparent 1px)
            `,
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        <Navbar />
        <div className="relative">
          <div className="grid place-items-center mt-10">
            <img
              src="/hero.png"
              className="w-full max-w-2xl px-4"
              alt="Hero image"
            />
          </div>
          <About />

          <PlayGame />
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
