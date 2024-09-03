"use client";

import {
  checkValidActions,
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
    isCORSEnabled: false,
  });
  const [getResponseData, setGetResponseData] = useState<any>();
  const [postResponseData, setPostResponseData] = useState<any>();
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
    }
  }, [publicKey]);

  const handleTransaction = async (transactionUrl: string) => {
    router.push(`/?url=${encodeURIComponent(url)}`);
    const encodedTxn = await fetchTransaction(transactionUrl, address);
    setPostResponseData(encodedTxn);
    const simulation = await simulateTransaction(
      encodedTxn?.transaction!,
      Cluster.MainnetBeta,
    );
    console.log(simulation.accounts, simulation.logs);
    setSimulatedData(simulation);
    setIsSimulating(false);
  };

  const getData = async () => {
    try {
      if (url.includes("localhost")) {
        const validationData = await getValidations(url, address);
        console.log("validationData", validationData);
        setValidations(validationData?.validations as unknown as Validations);
        setGetResponseData(validationData?.getData);
        await handleTransaction(url);
      } else {
        const actionsData = await validateURL(url);
        const actionUrl = actionsData?.result?.post[0]?.link;
        const isActionsJsonValid = await checkValidActions(url);
        const validationData = {
          isActionsJsonValid: isActionsJsonValid,
          isGetResponseValid:
            actionsData?.result?.get?.responseBody?.status === "ok",
          isOGImageValid: actionsData?.result?.get?.responseBody?.data?.icon,
          isOptionsResultValid:
            actionsData?.result?.options?.availability?.status === "ok",
          isPostResultValid:
            actionsData?.result?.post[0]?.availability?.status === "ok",
          isCORSEnabled: actionsData?.result?.get?.cors?.status === "ok",
        };
        setValidations(validationData as unknown as Validations);
        setGetResponseData(actionsData?.result?.get?.responseBody);
        setPostResponseData(actionsData?.result?.post[0]);
        if (!actionUrl) {
          return;
        }
        await handleTransaction(actionUrl);
      }
    } catch (error) {
      toast.error("Invalid Blink URL");
      console.error(error);
    } finally {
      setIsValidating(false);
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
        {/* Takes input of blink url */}
        <InputForm
          url={url}
          setUrl={setUrl}
          getData={getData}
          className="flex md:hidden items-center justify-center gap-2 mt-8 w-full"
        />
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
        {searchParams.get("url") && (
          <div className="flex gap-2 items-start justify-between mt-6">
            <Dashboard
              AccountList={simulatedData?.accounts!}
              Logs={simulatedData?.logs as string[]}
              Signatures={simulatedData?.signatureDetails!}
              Validations={validations}
              GetResponse={JSON.stringify(getResponseData)}
              PostResponse={JSON.stringify(postResponseData)}
              isValidating={isValidating}
              isSimulating={isSimulating}
            />
            <div className="flex justify-center mb-10">
              <div className="flex w-[30rem]">
                {/* Show preview of Blink */}
                <Blink url={url} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
