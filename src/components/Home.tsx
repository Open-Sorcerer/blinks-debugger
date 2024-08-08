"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import Blinks from "./Blinks";
import { validateURL } from "@/lib/helpers";
import Image from "next/image";

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
    <div className='flex flex-col w-full'>
      <div className='flex justify-between px-5 md:px-10 py-4 w-full h-fit'>
        <span className="flex gap-2 items-center text-xl tracking-wide">
        <Image
          src='/debugger.png'
          alt='Debugger'
          width={35}
          height={35}
          className="w-9 h-7"
        />
        Blinks Debugger
        </span>
        <UnifiedWalletButton />
      </div>
      <div className='flex items-center justify-center gap-2 mt-8 w-full'>
        <Input
          onChange={(e) => setUrl(e.target.value)}
          className='w-1/3'
          value={url}
          placeholder='Enter URL'
        />
        <Button onClick={getData} className="px-6">Submit</Button>
      </div>
      {isSubmitted && (
        <div className='flex items-center justify-center'>
          <div className='w-[30rem] mt-4'>
            <Blinks actionUrl={url} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
