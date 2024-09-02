"use client";

import {
  fetchTransaction,
  getValidations,
  simulateTransaction,
} from "@/app/_actions";
import ConfigContainer from "@/components/ConfigContainer/ConfigContainer";
import Dashboard from "@/components/Dashboard/Dashboard";
import InputForm from "@/components/InputForm/InputForm";
import Navbar from "@/components/Navbar/Navbar";
import { validateURL } from "@/lib/helpers";
import { Cluster, SimulationResult } from "@/types/blink";
import { Validations } from "@/types/common";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import Blink from "../Blink/Blink";

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publicKey } = useWallet();
  const [url, setUrl] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [mode, setMode] = useState<boolean>(true);
  const [simulatedData, setSimulatedData] = useState<SimulationResult>();
  const [validations, setValidations] = useState<Validations>({
    isActionsJsonValid: false,
    isGetResponseValid: false,
    isOGImageValid: false,
    isOptionsResultValid: false,
    isPostResultValid: false,
  });
  const [getResponseData, setGetResponseData] = useState<any>();
  const [postResponseData, setPostResponseData] = useState<any>();

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
    }
  }, [publicKey]);

  const handleTransaction = async (transactionUrl: string) => {
    router.push(`/?url=${encodeURIComponent(transactionUrl)}`);
    const encodedTxn = await fetchTransaction(transactionUrl, address);
    console.log("encoded", encodedTxn);
    const simulation = await simulateTransaction(
      encodedTxn?.transaction!,
      Cluster.MainnetBeta,
    );
    console.log(simulation.accounts, simulation.logs);
    setSimulatedData(simulation);
  };

  const getData = async () => {
    try {
      if (url.includes("localhost")) {
        const validationData = await getValidations(url, address);
        console.log("validationData", validationData);
        setValidations(validationData?.validations as unknown as Validations);
        setGetResponseData(validationData?.getData);
        setPostResponseData(validationData?.postData);
        await handleTransaction(url);
      } else {
        const actionUrl = await validateURL(url);
        if (!actionUrl) {
          return;
        }
        await handleTransaction(actionUrl);
      }
    } catch (error) {
      toast.error("Invalid Blink URL");
      console.error(error);
    }
  };

  useLayoutEffect(() => {
    if (searchParams.get("url")) {
      setUrl(searchParams.get("url")!);
      getData();
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Navbar url={url} setUrl={setUrl} getData={getData} />
      <div className="px-5 md:px-10">
        <div className="flex md:hidden items-center justify-center gap-2 mt-8 w-full">
          {/* Takes input of blink url */}
          <InputForm url={url} setUrl={setUrl} getData={getData} />
        </div>
        <div className="flex gap-4 items-center justify-end mt-5">
          {/* Set environment and identifier from Config */}
          <ConfigContainer
            address={address}
            setAddress={setAddress}
            mode={mode}
            setMode={setMode}
          />
        </div>
        {/* Blink debugged results show in dashboard with respective tabs. */}
        <div className="flex gap-2 justify-between mt-6">
          <Dashboard
            AccountList={simulatedData?.accounts!}
            Logs={simulatedData?.logs as string[]}
            Signatures={simulatedData?.signatureDetails!}
            Validations={validations}
          />
          {searchParams.get("url") && (
            <div className="flex items-center justify-center">
              <div className="flex w-[30rem] items-center justify-center">
                {/* Show preview of Blink */}
                <Blink url={url} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
