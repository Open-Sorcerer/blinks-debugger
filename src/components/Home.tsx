"use client";

import { validateURL } from "@/lib/helpers";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import Image from "next/image";
import { useState } from "react";
import Blinks from "./Blinks";
import Dashboard from "./Dashboard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Home = () => {
  const [url, setUrl] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const getData = async () => {
    try {
      const actionUrl = await validateURL(url);
      setUrl(actionUrl ?? url);
      const response = await fetch(actionUrl ?? url);
      const data = await response.json();
      if (data) {
        setIsSubmitted(true);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between py-4 w-full h-fit">
        <span className="flex gap-4 items-center font-medium text-xl tracking-wide">
          <Image
            src="/logo.svg"
            alt="Debugger"
            width={30}
            height={30}
            className="w-6 h-6"
          />
          Blinks Debugger
        </span>
        <UnifiedWalletButton />
      </div>
      <div className="flex items-center justify-center gap-2 mt-8 w-full">
        <Input
          onChange={(e) => setUrl(e.target.value)}
          className="w-1/3 bg-[#fff] border border-neutral-200 shadow-lg"
          value={url}
          placeholder="Enter URL"
        />
        <Button
          onClick={getData}
          className="px-6 py-[1.4rem] bg-neutral-800 hover:bg-black transition-colors duration-100 delay-100 text-white disabled:bg-neutral-600"
        >
          Submit
        </Button>
      </div>
      <Dashboard />
      {isSubmitted && (
        <div className="flex items-center justify-center">
          <div className="w-[30rem] mt-4">
            <Blinks actionUrl={url} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
