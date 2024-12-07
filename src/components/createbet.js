import React, { useState } from "react";
import { useWriteContract, useWatchContractEvent } from "wagmi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  betABI,
  betAddress,
  usdcContractABI,
  usdcContractAddress,
} from "@/utils/contracts";
import { SignJWT, jwtVerify } from "jose";
import { parseUnits } from "viem";

const CreateBetSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [timeToEnd, setTimeToEnd] = useState("");
  const [hostTwitter, setHostTwitter] = useState("");
  const [encryptedKey, setEncryptedKey] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const { writeContract, isPending, isError } = useWriteContract();

  useWatchContractEvent({
    address: betAddress,
    abi: betABI,
    eventName: "BetCreated",
    onLogs(logs) {
      console.log(logs);
      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsOpen(false);
        // Reset form
        setAmount("");
        setTimeToEnd("");
        setHostTwitter("");
        setEncryptedKey("");
        setEmail("");
        setIsSuccess(false);
      }, 2000);
    },
  });

  async function createToken(data) {
    const secretKey = new TextEncoder().encode("your-secret-key");

    const token = await new SignJWT({ data })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("70h")
      .sign(secretKey);

    return token;
  }

  async function verifyToken(token) {
    const secretKey = new TextEncoder().encode("your-secret-key");

    try {
      const { payload } = await jwtVerify(token, secretKey);
      return payload;
    } catch (error) {
      console.error("Error verifying token:", error);
      throw error;
    }
  }

  const handleMintAndApprove = async () => {
    setIsMinting(true);
    try {
      await writeContract({
        address: usdcContractAddress,
        abi: usdcContractABI,
        functionName: "transferFromOwner",
        args: [betAddress],
      });
    } catch (error) {
      console.error("Error minting and approving:", error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token;
    try {
      token = await createToken(encryptedKey);
      // console.log("Created token:", token);
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      // Convert USDC amount to the correct decimals (6 decimals for USDC)
      const amountInUSDC = parseUnits(amount.toString(), 6)
      const sevenDaysInSeconds = 7 * 24 * 60 * 60; // 7 days in seconds
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      const timeToEndSeconds = BigInt(currentTimestamp + sevenDaysInSeconds);

      setIsSubmitting(true);
      await writeContract({
        address: betAddress,
        abi: betABI,
        functionName: "hostBet",
        args: [
          amountInUSDC,
          timeToEndSeconds,
          hostTwitter,
          token,
          email,
          usdcContractAddress,
        ],
      });
    } catch (error) {
      console.error("Error creating bet:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="border-2 border-black bg-white">
          Create New Bet
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Bet</SheetTitle>
          <SheetDescription>
            Enter the details for your new bet
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex justify-end w-full">
          <Button
            variant="ghost"
            onClick={handleMintAndApprove}
            disabled={isMinting}
          >
            {isMinting ? "Processing..." : "Mint & Approve"}
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Bet Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeToEnd">Time Until End (hours)</Label>
            <Input
              id="timeToEnd"
              type="number"
              step="1"
              min="1"
              value={timeToEnd}
              onChange={(e) => setTimeToEnd(e.target.value)}
              placeholder="24"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hostTwitter">Twitter Handle</Label>
            <Input
              id="hostTwitter"
              value={hostTwitter}
              onChange={(e) => setHostTwitter(e.target.value)}
              placeholder="@username"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="encryptedKey">Enter Private Key</Label>
            <Input
              id="encryptedKey"
              value={encryptedKey}
              onChange={(e) => setEncryptedKey(e.target.value)}
              placeholder="Enter Private Key"
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full border-2 border-black"
            disabled={isPending || isSubmitting}
          >
            {isPending ? "Creating..." : "Create Bet"}
          </Button>
          {isError && (
            <div className="text-red-600 text-sm mt-2">
              Error creating bet. Please try again.
            </div>
          )}
          {isSuccess && (
            <div className="text-green-600 text-sm mt-2">
              Bet created successfully!
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateBetSheet;