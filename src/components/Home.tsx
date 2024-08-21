"use client";

import { validateURL } from "@/lib/helpers";
import { useState } from "react";
import Blinks from "./Blinks";
import Dashboard from "./Dashboard";
import Form from "./Form";
import Header from "./Header";

const Home = () => {
  const [url, setUrl] = useState<string>("");
  const [address, setAddress] = useState<string>("");
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
      <Header
        url={url}
        setUrl={setUrl}
        address={address}
        setAddress={setAddress}
        getData={getData}
      />
      <div className="px-5 md:px-10">
        <div className="flex lg:hidden items-center justify-center gap-2 mt-8 w-full">
          <Form
            url={url}
            setUrl={setUrl}
            address={address}
            setAddress={setAddress}
            getData={getData}
          />
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
    </div>
  );
};

export default Home;
