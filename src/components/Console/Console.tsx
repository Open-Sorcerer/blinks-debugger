import {
  accountList,
  signatureData,
  signatureSectionHeader,
  simulationData,
} from "@/lib/constants";
import { formatData } from "@/lib/utils";
import toast from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5";

export default function Console() {
  return (
    <div className="flex flex-col gap-4 max-h-[34rem] scroll-smooth scrollbar">
      {/* SIGNATURE */}
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
            {signatureData.map((data, index) => (
              <span
                className="grid grid-cols-[80px_200px_180px_150px_100px] py-1 text-neutral-700 border-b border-neutral-100"
                key={index}
              >
                <p>{index + 1}</p>
                <button
                  className="flex w-fit h-fit gap-2 items-center text-indigo-500"
                  onClick={() => {
                    navigator.clipboard.writeText(data.signature);
                    toast.success("Copied");
                  }}
                >
                  {formatData(data.signature)} <IoCopyOutline />
                </button>
                <button
                  className="flex w-fit h-fit gap-2 items-center text-indigo-500"
                  onClick={() => {
                    navigator.clipboard.writeText(data.signer);
                    toast.success("Copied");
                  }}
                >
                  {formatData(data.signer)} <IoCopyOutline />
                </button>
                <p
                  className={`w-fit h-fit px-4 py-1 rounded-2xl text-sm ${data.validity.toLocaleLowerCase() === "valid" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}
                >
                  {data.validity}
                </p>
                <p className="w-fit h-fit bg-blue-50 text-blue-500 text-sm px-4 py-1 rounded-2xl">
                  Fee Payer
                </p>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Account List */}
      <div className="flex flex-col border border-neutral-200 rounded-xl p-[2px]">
        <span className="bg-neutral-100 text-neutral-700 font-medium px-4 py-2.5 rounded-t-xl">
          Account List
        </span>
        <div className="flex flex-col gap-2 p-2 overflow-auto scroll-smooth scrollbar">
          {accountList.map((account, index) => (
            <span
              className="flex w-[40rem] md:w-full px-3 py-2.5 items-center justify-between border border-neutral-200 text-neutral-500 rounded-lg"
              key={index}
            >
              <p>Account #{index + 1}</p>
              <button
                className="flex w-fit h-fit gap-2 items-center text-violet-500"
                onClick={() => {
                  navigator.clipboard.writeText(account);
                  toast.success("Copied");
                }}
              >
                {account} <IoCopyOutline />
              </button>
            </span>
          ))}
        </div>
      </div>
      {/* Transaction Simulation */}
      <div className="flex flex-col border border-neutral-200 rounded-xl p-[2px]">
        <span className="bg-neutral-100 text-neutral-700 font-medium px-4 py-2.5 rounded-t-xl">
          Logs
        </span>
        <div className="flex flex-col gap-1 p-3 overflow-auto scroll-smooth scrollbar">
          {simulationData.map((data, index) => (
            <span
              className="grid grid-cols-[40px_80px] items-center text-neutral-700"
              key={index}
            >
              <p className="text-neutral-400">{index + 1}</p>
              <p className="text-nowrap">{data}</p>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
