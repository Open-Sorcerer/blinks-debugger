import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatAddress } from "@/lib/utils";
import { IoMdRocket } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { MdBuild } from "react-icons/md";

interface ConfigContainerProps {
  address: string;
  setAddress: (address: string) => void;
  mode: boolean;
  setMode: (mode: boolean) => void;
}

export default function ConfigContainer({
  address,
  setAddress,
  mode,
  setMode,
}: ConfigContainerProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-6 py-[1.4rem] bg-neutral-800 hover:bg-black transition-colors duration-100 delay-100 text-white disabled:bg-neutral-600">
            Address: {address ? formatAddress(address) : "none"}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-neutral-100">
          <DialogHeader>
            <DialogTitle>Place identifier</DialogTitle>
            <DialogDescription>
              Set an address to simulate this blink
            </DialogDescription>
          </DialogHeader>
          <Input
            onChange={(e) => setAddress(e.target.value)}
            className="bg-[#fff] border border-neutral-200 shadow-lg"
            value={address}
            placeholder="Paste your address"
          />
          <DialogClose asChild>
            <Button className="px-6 py-[1.4rem] bg-neutral-800 hover:bg-black transition-colors duration-100 delay-100 text-white disabled:bg-neutral-600">
              Save changes
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Button
        className="gap-2 bg-white border border-neutral-300 px-6 py-[1.4rem] transition-colors duration-100 delay-100 hover:bg-neutral-50"
        onClick={() => {
          setMode(!mode);
        }}
      >
        {mode ? <IoMdRocket size={20} /> : <MdBuild size={20} />}{" "}
        {mode ? "Mainnet" : "Testnet"}
      </Button>
      <Button
        className="bg-white border border-neutral-300 px-3 py-[1.4rem] transition-colors duration-100 delay-100 hover:bg-neutral-50"
        onClick={() => {
          // TODO: Add revalidate blink
        }}
      >
        <LuRefreshCcw size={24} className="text-neutral-600" />
      </Button>
    </>
  );
}
