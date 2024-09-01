import { Blink } from "@/types/blink";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "../Spinner/Spinner";
import { Button } from "../ui/button";

export default function RenderSingleButton({
  blink,
  link,
  disabled,
}: {
  blink: Blink;
  link: string;
  disabled: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  //   const { fetchTransaction } = useBlink();
  const { publicKey, sendTransaction } = useWallet();

  const handlePress = async (link: string) => {
    try {
      setIsLoading(true);
      if (!publicKey) return;
      //   const result = await fetchTransaction(link, publicKey!.toBase58());
      //   let transaction = result.transaction;
      //   const tx = await getRawTransaction(transaction);
      //   const sign = await sendTransaction(tx as Transaction, connection);
      //   if (result?.message) {
      //     toast.success(result.message);
      //   } else {
      //     toast.success("Transaction successfull");
      //   }
    } catch (e) {
      toast.error("Failed to submit transaction");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading || disabled}
      onClick={async () => {
        handlePress(link);
      }}
      className="w-full"
      variant={"secondary"}
    >
      {isLoading ? <Spinner /> : blink.label}
    </Button>
  );
}
