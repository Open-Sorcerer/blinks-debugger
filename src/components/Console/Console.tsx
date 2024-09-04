import { signatureSectionHeader } from "@/lib/constants";
import { formatData } from "@/lib/utils";
import { AccountInfoObject, SignatureDetails } from "@/types/blink";
import toast from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5";

interface ConsoleProps {
  AccountList: Array<AccountInfoObject>;
  Logs: string[];
  Signatures: Array<SignatureDetails>;
}

export default function Console({
  AccountList,
  Logs,
  Signatures,
}: ConsoleProps) {
  return (
    <div className="flex flex-col gap-4 max-h-[34rem] scroll-smooth scrollbar">
      {/* SIGNATURE */}
      {AccountList.length === 0 && (
        <span>Simulation fails if now default button</span>
      )}
      <div className="flex flex-col border border-neutral-200 rounded-xl p-[2px]">
        <span className="bg-neutral-100 text-neutral-700 font-medium px-4 py-2.5 rounded-t-xl">
          Signatures
        </span>
        <div className="px-4 py-2 overflow-auto scroll-smooth scrollbar">
          <div className="grid grid-cols-[80px_200px_180px_150px_100px] py-1 text-neutral-500 border-b border-neutral-200">
            {signatureSectionHeader.map((header, index) => (
              <p className="uppercase" key={index}>
                {header}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-1 pt-2">
            {Signatures?.map(
              ({ signature, signer, validity, details }, index) => {
                return (
                  <span
                    className="grid grid-cols-[80px_200px_180px_150px_100px] py-1 text-neutral-700 border-b border-neutral-100"
                    key={index}
                  >
                    <p>{index + 1}</p>
                    <button
                      className="flex w-fit h-fit gap-2 items-center text-indigo-500"
                      onClick={() => {
                        navigator.clipboard.writeText(signature);
                        toast.success("Copied");
                      }}
                    >
                      {formatData(signature)} <IoCopyOutline />
                    </button>
                    <button
                      className="flex w-fit h-fit gap-2 items-center text-indigo-500"
                      onClick={() => {
                        navigator.clipboard.writeText(signer);
                        toast.success("Copied");
                      }}
                    >
                      {formatData(signer)} <IoCopyOutline />
                    </button>
                    <p
                      className={`w-fit h-fit px-4 py-1 rounded-2xl text-sm ${validity.toLocaleLowerCase() === "valid" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}
                    >
                      {validity}
                    </p>
                    <p className="w-fit h-fit bg-blue-50 text-blue-500 text-sm px-4 py-1 rounded-2xl">
                      {details}
                    </p>
                  </span>
                );
              },
            )}
          </div>
        </div>
      </div>
      {/* Account List */}
      <div className="flex flex-col border border-neutral-200 rounded-xl p-[2px]">
        <span className="bg-neutral-100 text-neutral-700 font-medium px-4 py-2.5 rounded-t-xl">
          Account List
        </span>
        <div className="flex flex-col gap-2 p-2 overflow-auto scroll-smooth scrollbar">
          {AccountList?.map(({ pubkey, accountInfo }, index) => {
            return (
              <span
                className="flex w-[40rem] md:w-full px-3 py-2.5 items-center justify-between border border-neutral-200 text-neutral-500 rounded-lg"
                key={`${index}-index`}
              >
                <p>Account #{index + 1}</p>
                <button
                  key={`${index}-button`}
                  className="flex w-fit h-fit gap-2 items-center text-violet-500"
                  onClick={() => {
                    navigator.clipboard.writeText(pubkey.toString());
                    toast.success("Copied");
                  }}
                >
                  {accountInfo?.[0].friendlyName ?? pubkey.toString()}{" "}
                  <IoCopyOutline />
                </button>
              </span>
            );
          })}
        </div>
      </div>
      {/* Transaction Simulation */}
      <div className="flex flex-col border border-neutral-200 rounded-xl p-[2px]">
        <span className="bg-neutral-100 text-neutral-700 font-medium px-4 py-2.5 rounded-t-xl">
          Logs
        </span>
        <div className="flex flex-col gap-1 p-3 overflow-auto scroll-smooth scrollbar">
          {Logs?.map((data, index) => {
            return (
              <span
                className="grid grid-cols-[40px_80px] items-center text-neutral-700"
                key={index}
              >
                <p className="text-neutral-400">{index + 1}</p>
                <p className="text-nowrap">{data}</p>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
