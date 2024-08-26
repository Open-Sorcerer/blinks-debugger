"use client";

import { fetchTransaction, simulateTransaction } from "@/app/_actions";
import { useWallet } from "@jup-ag/wallet-adapter";

import BlinkPreview from "@/components/BlinkPreview/BlinkPreview";
import ConfigContainer from "@/components/ConfigContainer/ConfigContainer";
import Dashboard from "@/components/Dashboard/Dashboard";
import InputForm from "@/components/InputForm/InputForm";
import Navbar from "@/components/Navbar/Navbar";
import { validateURL } from "@/lib/helpers";
import { Cluster, SimulationResult } from "@/types/blink/Metadata";
import { useState } from "react";

export default function Home() {
  const { publicKey } = useWallet();
  const [url, setUrl] = useState<string>("");
  const [address, setAddress] = useState<string>(publicKey?.toBase58() ?? "");
  const [mode, setMode] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [simulatedData, setSimulatedData] = useState<SimulationResult>();

  const getData = async () => {
    try {
      const actionUrl = await validateURL(url);
      setUrl(actionUrl ?? url);
      const response = await fetch(actionUrl ?? url);
      const data = await response.json();
      if (data) {
        setIsSubmitted(true);
      }
      const encodedTxn = await fetchTransaction(url, address);
      const simulation = await simulateTransaction(
        encodedTxn?.transaction!,
        Cluster.MainnetBeta,
      );
      console.log(simulation.accountInfo, simulation.logs);
      setSimulatedData(simulation);
    } catch (error) {
      console.error(error);
    }
  };

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
        <div className="flex justify-between">
          {isSubmitted && (
            <div className="flex items-center justify-center">
              <div className="w-[30rem] -mt-12">
                {/* Show preview of Blink */}
                <BlinkPreview actionUrl={url} />
              </div>
            </div>
          )}
          <Dashboard
            AccountList={simulatedData?.accountInfo as string[]}
            Logs={simulatedData?.logs as string[]}
          />
        </div>
      </div>
    </div>
  );
}
