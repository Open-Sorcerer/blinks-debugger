"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import Blinks from "./Blinks";

const Home = () => {
  const [url, setUrl] = useState<string>("");

  const getData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='flex justify-end px-4 py-2 w-full h-fit'>
        <UnifiedWalletButton />
      </div>
      <div className='flex items-center justify-center gap-2 mt-8 w-full'>
        <Input
          onChange={(e) => setUrl(e.target.value)}
          className='w-1/3'
          value={url}
          placeholder='Enter URL'
        />
        <Button onClick={getData}>Submit</Button>
      </div>
      <div className='flex items-center justify-center'>
        <div className='w-[30rem] mt-4'>
          <Blinks actionUrl={url} />
        </div>
      </div>
    </div>
  );
};

export default Home;
