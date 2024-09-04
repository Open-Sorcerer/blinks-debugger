import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function Requests({
  GetResponse,
  PostResponse,
}: {
  GetResponse: string;
  PostResponse: string;
}) {
  return (
    <div className="flex flex-col gap-2 max-h-[34rem] scroll-smooth scrollbar">
      <div className="text-lg text-indigo-500 font-semibold">Get Response</div>
      <div className="bg-neutral-100 rounded-xl p-4 relative">
        <pre className="whitespace-pre-wrap break-words w-full overflow-x-auto">
          {GetResponse && JSON.stringify(JSON.parse(GetResponse).data, null, 2)}
        </pre>
        <button
          className="absolute w-fit top-3 right-3 text-neutral-500 hover:text-neutral-800"
          onClick={() => {
            navigator.clipboard.writeText(
              JSON.stringify(JSON.parse(GetResponse).data, null, 2),
            );
            toast.success("Copied");
          }}
        >
          <Copy size={20} />
        </button>
      </div>
      <div className="text-lg text-indigo-500 font-semibold mt-5">
        Post Response
      </div>
      <div className="bg-neutral-100 rounded-xl p-4 relative">
        {PostResponse ? (
          (() => {
            try {
              const parsedResponse = JSON.parse(PostResponse);
              if (parsedResponse.error) {
                return (
                  <div className="text-red-500">
                    Error: Failed to fetch the transaction data.
                  </div>
                );
              }
              return (
                <>
                  <pre className="whitespace-pre-wrap break-words w-full overflow-x-auto">
                    {JSON.stringify(parsedResponse, null, 2)}
                  </pre>
                  <button
                    className="absolute w-fit top-3 right-3 text-neutral-500 hover:text-neutral-800"
                    onClick={() => {
                      navigator.clipboard.writeText(PostResponse);
                      toast.success("Copied");
                    }}
                  >
                    <Copy size={20} />
                  </button>
                </>
              );
            } catch (error) {
              return (
                <div className="text-red-500">
                  Error: Failed to fetch the transaction data.
                </div>
              );
            }
          })()
        ) : (
          <div className="text-red-500">Error: No response received.</div>
        )}
      </div>
    </div>
  );
}
