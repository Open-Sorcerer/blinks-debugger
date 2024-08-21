import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import Image from "next/image";
import Form from "./Form";

interface IHeader {
  url: string;
  setUrl: (url: string) => void;
  address: string;
  setAddress: (address: string) => void;
  getData: () => void;
}

export default function Header({
  url,
  setUrl,
  address,
  setAddress,
  getData,
}: IHeader) {
  return (
    <div className="flex w-full items-center justify-between p-4 bg-white border-b border-neutral-300">
      <div className="flex w-full items-center justify-start gap-5">
        <span className="flex gap-4 items-center font-medium text-xl tracking-wide">
          <Image
            src="/logo.svg"
            alt="Debugger"
            width={30}
            height={30}
            className="w-6 h-6"
          />
          <p className="hidden sm:flex">Blinks Debugger</p>
        </span>
        <span className="hidden lg:flex items-center justify-center gap-2">
          <Form
            url={url}
            setUrl={setUrl}
            address={address}
            setAddress={setAddress}
            getData={getData}
            className="min-w-[25rem]"
          />
        </span>
      </div>
      <div className="flex md:w-[40%] justify-end">
        <UnifiedWalletButton />
      </div>
    </div>
  );
}
