import React, { useState, useEffect } from "react";
import About from "./about";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const PlayGame = ({ chainid, betid, contractAddress }) => {
  const [betAmount, setBetAmount] = useState("");
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();

  console.log(currentChainId);

  const handleQuickBet = (amount) => {
    setBetAmount(amount);
  };

  const quickBets = [10, 20, 50, 100, 200, 500];

  // Show wrong network message if connected but on wrong chain
  if (
    isConnected &&
    chainid !== undefined &&
    currentChainId.toString() !== chainid
  ) {
    return (
      <div className="pt-12">
        <div className="px-4 sm:px-16">
          <div className="bg-purple-600 rounded-xl border-4 border-black shadow-custom p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Wrong Network
              </h2>
              <p className="text-white mb-6 font-mono">
                Please switch to the correct network to continue
              </p>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => (
                  <Button
                    onClick={openChainModal}
                    className="border-2 border-black bg-pink-500 text-white hover:bg-pink-600"
                  >
                    Switch Network
                  </Button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
        <About />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="pt-12">
        <div className="px-4 sm:px-16">
          <div className="bg-purple-600 rounded-xl border-4 border-black shadow-custom p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Connect Your Wallet
              </h2>
              <p className="text-white mb-6 font-mono">
                Please connect your wallet to start playing
              </p>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  return (
                    <Button
                      onClick={openConnectModal}
                      className="border-2 border-black bg-pink-500 text-white hover:bg-pink-600"
                    >
                      Connect Wallet
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
        <About />
      </div>
    );
  }

  return (
    <div className="pt-12">
      <div className="px-4 sm:px-16">
        <div className="bg-purple-600 rounded-xl border-4 border-black shadow-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 overflow-hidden">
            {/* Left side - Betting Options */}
            <div className="border-b-4 sm:border-b-0 sm:border-r-4 border-black p-4 sm:p-8 bg-blue-500 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Betting Options
              </h2>
              <div className="space-y-4">
                <div className="bg-white border-2 border-black rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Quick Bets
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {quickBets.map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => handleQuickBet(amount)}
                        className={`border-black text-sm sm:text-base ${
                          parseInt(betAmount) === amount
                            ? "bg-white text-black"
                            : "bg-blue-500 text-white"
                        }`}
                        variant={
                          parseInt(betAmount) === amount ? "default" : "reverse"
                        }
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Game Rules
                  </h3>
                  <ul className="space-y-1 sm:space-y-2 font-mono text-sm sm:text-base">
                    <li>• Minimum bet: $10</li>
                    <li>• Maximum bet: $1000</li>
                    <li>• Multiple bets allowed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right side - Place Bet */}
            <div className="p-4 sm:p-8 bg-pink-500 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Place Your Bet
              </h2>
              <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <label className="block mb-2 text-sm sm:text-base">
                    Enter Bet Amount
                  </label>
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
                <Button className="w-full border-black bg-pink-500 text-white text-sm sm:text-base">
                  Place Bet
                </Button>
                <div className="mt-4 text-black text-center text-sm sm:text-base">
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