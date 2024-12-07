import React, { useState } from "react";
import About from "./about";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const PlayGame = () => {
  const [betAmount, setBetAmount] = useState("");

  // Handler for quick bet selection
  const handleQuickBet = (amount) => {
    setBetAmount(amount);
  };

  const quickBets = [10, 20, 50, 100, 200, 500];

  return (
    <div className="pt-24">
      <div className="px-16">
        <div className="bg-purple-600 rounded-xl h-[700px] border-4 border-black shadow-custom">
          <div className="grid grid-cols-2 h-full overflow-hidden">
            {/* Left side - Betting Options */}
            <div className="border-r-4 border-black p-8 bg-blue-500 rounded-l-lg">
              <h2 className="text-2xl font-bold text-white mb-6">
                Betting Options
              </h2>
              <div className="space-y-4">
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Quick Bets</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {quickBets.map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => handleQuickBet(amount)}
                        className={`border-black ${
                          parseInt(betAmount) === amount
                            ? "bg-white text-black"
                            : "bg-blue-500 text-white"
                        }`}
                        variant={
                          parseInt(betAmount) === amount
                            ? "default"
                            : "reverse"
                        }
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Game Rules</h3>
                  <ul className="space-y-2 font-mono">
                    <li>• Minimum bet: $10</li>
                    <li>• Maximum bet: $1000</li>
                    <li>• Multiple bets allowed</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Right side - Place Bet */}
            <div className="p-8 bg-pink-500 rounded-r-lg">
              <h2 className="text-2xl font-bold mb-6">Place Your Bet</h2>
              <div className="bg-white border-2 border-black rounded-lg p-6">
                <div className="mb-6">
                  <label className="block mb-2">Enter Bet Amount</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full shadow-light border-black"
                    placeholder="Enter amount"
                    min="10"
                    max="1000"
                  />
                </div>
                <Button className="w-full border-black bg-pink-500 text-white">
                  Place Bet
                </Button>
                <div className="mt-4 text-black text-center">
                  Selected Amount: ${betAmount || "0"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <About />
    </div>
  );
};

export default PlayGame;
