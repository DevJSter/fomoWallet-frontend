import React from "react";
import { Button } from "@/components/ui/button";
import About from "./about";

const Navbar = () => {
  return (
    <nav className="px-4 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-12" alt="Logo" />
          <p className="font-semibold text-3xl">Fomo Wallet</p>
        </div>
        <div className="flex items-center">
          <div className="flex gap-6 text-purple-800">
            {/* Navigation links commented out but preserved */}
          </div>
          <Button className="border-black bg-purple-600 text-white font-semibold">
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0" />
      <div className="absolute inset-0">
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
      <Navbar />
      <div className="relative">
        <div className="grid place-items-center  mt-10">
          <img
            src="/hero.png"
            className="w-full max-w-2xl px-4"
            alt="Hero image"
          />
        </div>
        <About />
      </div>
    </div>
  );
};

export default LandingPage;
