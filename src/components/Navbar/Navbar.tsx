import InputForm from "@/components/InputForm/InputForm";
import dynamic from "next/dynamic";
import Image from "next/image";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      ({ WalletMultiButton }) => WalletMultiButton,
    ),
  { ssr: false },
);

interface NavbarProps {
  url: string;
  setUrl: (url: string) => void;
  getData: () => void;
}

export default function Navbar({ url, setUrl, getData }: NavbarProps) {
  return (
    <div className="flex w-full items-center justify-between p-4 bg-white border-b border-neutral-300">
      <div className="flex w-full items-center justify-start gap-10">
        <span className="flex gap-4 items-center font-medium text-xl tracking-wide">
          <Image
            src="/logo.svg"
            alt="Debugger"
            width={30}
            height={30}
            className="w-6 h-6"
          />
          <p className="hidden lg:flex">Blinks Debugger</p>
        </span>
        <span className="hidden md:flex items-center justify-center gap-2">
          <InputForm
            url={url}
            setUrl={setUrl}
            getData={getData}
            className="min-w-[25rem]"
          />
        </span>
      </div>
      <div className="flex md:w-[40%] justify-end">
        <WalletMultiButton />
      </div>
    </div>
  );
}
