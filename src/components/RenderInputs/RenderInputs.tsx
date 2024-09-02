import useBlink from "@/hooks/useBlink";
import { Action } from "@/types/blink";
import { connection, getRawTransaction } from "@/utils/helper";
import { useWallet } from "@jup-ag/wallet-adapter";
import { Transaction } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "../Spinner/Spinner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function RenderInputs({
  action,
  link,
  disabled,
}: {
  action: Action;
  link: string;
  disabled: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchTransaction } = useBlink();
  const { publicKey, sendTransaction } = useWallet();
  const host = new URL(link)?.hostname;

  const handlePress = async (link: string) => {
    try {
      setIsLoading(true);
      if (!publicKey) return;
      const result = await fetchTransaction(link, publicKey!.toBase58());
      let transaction = result?.transaction;
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

  return (
    <div className="flex flex-col gap-3" key={""}>
      {action?.parameters?.map((parameter) => (
        <Input
          placeholder={parameter.label}
          key={parameter.name}
          name={parameter.name}
        />
      ))}
      <Button
        disabled={isLoading || disabled}
        key={action.label}
        variant={"secondary"}
        size={"lg"}
        onClick={async () => {
          let actionUrl = action.href;
          action?.parameters?.forEach((param) => {
            const value = (
              document.querySelector(
                `input[name=${param.name}]`,
              ) as HTMLInputElement
            ).value;
            actionUrl = actionUrl.replace(`{${param.name}}`, value);
          });
          if (actionUrl.startsWith("http")) {
            handlePress(actionUrl);
          } else {
            handlePress("https://" + host + actionUrl);
          }
        }}
      >
        {isLoading ? <Spinner /> : action.label}
      </Button>
    </div>
  );
}
