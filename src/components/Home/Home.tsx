"use client";

import { fetchTransaction, simulateTransaction } from "@/app/_actions";

import BlinkPreview from "@/components/BlinkPreview/BlinkPreview";
import ConfigContainer from "@/components/ConfigContainer/ConfigContainer";
import Dashboard from "@/components/Dashboard/Dashboard";
import InputForm from "@/components/InputForm/InputForm";
import Navbar from "@/components/Navbar/Navbar";
import { validateURL } from "@/lib/helpers";
import { Cluster, SimulationResult } from "@/types/blink/Metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publicKey } = useWallet();
  const [url, setUrl] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [mode, setMode] = useState<boolean>(true);
  const [simulatedData, setSimulatedData] = useState<SimulationResult>();

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
    }
  }, [publicKey]);

  const getData = async () => {
    try {
      const actionUrl = await validateURL(url);
      if (!actionUrl) {
        return;
      }
      router.push(`/?url=${encodeURIComponent(actionUrl)}`);
      const encodedTxn = await fetchTransaction(actionUrl, address);
      console.log("encoded", encodedTxn);
      const simulation = await simulateTransaction(
        encodedTxn?.transaction!,
        Cluster.MainnetBeta,
      );
      console.log(simulation.accounts, simulation.logs);
      setSimulatedData(simulation);
    } catch (error) {
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
        <div className="flex justify-between">
          {searchParams.get("url") && (
            <div className="flex items-center justify-center">
              <div className="w-[30rem] -mt-12">
                {/* Show preview of Blink */}
                <BlinkPreview actionUrl={searchParams.get("url")!} />
              </div>
            </div>
          )}
          <Dashboard
            AccountList={simulatedData?.accounts!}
            Logs={simulatedData?.logs as string[]}
            Signatures={simulatedData?.signatureDetails!}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
