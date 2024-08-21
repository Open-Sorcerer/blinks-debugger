import { formatAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface IForm {
  url: string;
  setUrl: (url: string) => void;
  address: string;
  setAddress: (address: string) => void;
  getData: () => void;
  className?: string;
}

export default function Form({
  url,
  setUrl,
  address,
  setAddress,
  getData,
  className,
}: IForm) {
  return (
    <>
      <Input
        onChange={(e) => setUrl(e.target.value)}
        className={
          `bg-[#fff] border border-neutral-200 shadow ` +
          `${className && className}`
        }
        value={url}
        placeholder="Enter URL"
      />
      <Button
        onClick={getData}
        className="px-6 py-[1.4rem] bg-neutral-800 hover:bg-black transition-colors duration-100 delay-100 text-white disabled:bg-neutral-600"
      >
        Submit
      </Button>
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
    </>
  );
}
