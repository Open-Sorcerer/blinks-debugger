import useBlink from "@/hooks/useBlink";
import { Action } from "@/types/blink";
import { connection, getRawTransaction } from "@/utils/helper";
import { useWallet } from "@jup-ag/wallet-adapter";
import { Transaction } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "../Spinner/Spinner";
import { Button } from "../ui/button";

export default function RenderMultipleButtons({
  action,
  link,
  count,
  disabled,
}: {
  action: Action;
  link: string;
  count: number;
  disabled: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchTransaction } = useBlink();
  const { publicKey, sendTransaction } = useWallet();
  const host = new URL(link).hostname;
  console.log("action", action);

  const handlePress = async (link: string) => {
    try {
      setIsLoading(true);
      if (!publicKey) return;
      const result = await fetchTransaction(link, publicKey!.toBase58());
      let transaction = result?.transaction;
      console.log(result);
      const tx = await getRawTransaction(transaction!);
      const sign = await sendTransaction(tx as Transaction, connection);
      if (result?.message) {
        toast.success(result.message);
      } else {
        toast.success("Transaction successfull");
      }
    } catch (e) {
      toast.error("Failed to submit transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonClass = () => {
    if (count % 2 === 0) {
      return "w-1/2";
    } else if (count % 3 === 0) {
      return "w-1/3";
    } else {
      return "w-full";
    }
  };

  return (
    <div className={`${getButtonClass()} p-1`}>
      <Button
        disabled={isLoading || disabled}
        key={action.label}
        onClick={async () => {
          let actionUrl = action.href;
          if (actionUrl.includes("https")) {
            handlePress(actionUrl);
          } else {
            handlePress("https://" + host + actionUrl);
          }
        }}
        variant={"secondary"}
        className="w-full bg-neutral-800 hover:bg-black rounded-xl"
        size={"lg"}
      >
        {isLoading ? <Spinner /> : action.label}
      </Button>
    </div>
  );
}
