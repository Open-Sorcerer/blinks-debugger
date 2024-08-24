import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InputFormProps {
  url: string;
  setUrl: (url: string) => void;
  getData: () => void;
  className?: string;
}

export default function InputForm({
  url,
  setUrl,
  getData,
  className,
}: InputFormProps) {
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
    </>
  );
}
