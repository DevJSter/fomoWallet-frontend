import React, { useState } from "react";
import { useWriteContract, useWatchContractEvent } from "wagmi";
import { parseEther } from "viem";
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
import { betABI, betAddress } from "@/utils/contracts";

const CreateBetSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [timeToEnd, setTimeToEnd] = useState("");
  const [hostTwitter, setHostTwitter] = useState("");
  const [encryptedKey, setEncryptedKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
        setIsSuccess(false);
      }, 2000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const amountInWei = parseEther(amount);
      // Convert timeToEnd to seconds if entered in hours
      const timeToEndSeconds = BigInt(Math.floor(Number(timeToEnd) * 3600));

      await writeContract({
        address: betAddress,
        abi: betABI,
        functionName: "hostBet",
        args: [amountInWei, timeToEndSeconds, hostTwitter, encryptedKey],
        value: amountInWei, // Match the amount for payable function
      });
    } catch (error) {
      console.error("Error creating bet:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className='border-2 border-black'>Create New Bet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Bet</SheetTitle>
          <SheetDescription>
            Enter the details for your new bet
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Bet Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
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
            <Label htmlFor="encryptedKey">Encrypted Key</Label>
            <Input
              id="encryptedKey"
              value={encryptedKey}
              onChange={(e) => setEncryptedKey(e.target.value)}
              placeholder="Enter encrypted key"
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
