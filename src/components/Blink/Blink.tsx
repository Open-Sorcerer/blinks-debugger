import useBlink from "@/hooks/useBlink";
import type { Blink } from "@/types/blink";
import { useEffect, useState } from "react";
import RenderInputs from "../RenderInputs/RenderInputs";
import RenderMultipleButtons from "../RenderMultipleButtons/RenderMultipleButtons";
import RenderSingleButton from "../RenderSingleButton/RenderSingleButton";

interface BlinkProps {
  url: string;
}

export default function Blink({ url }: BlinkProps) {
  const { fetchBlink } = useBlink();
  const [currentBlink, setCurrentBlink] = useState<Blink | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const blink = await fetchBlink(url);
        console.log("blink", blink);
        setCurrentBlink(blink);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetch();
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }
  return (
    <div className="w-5/6 flex flex-col max-w-6xl bg-white gap-5 p-6 border border-neutral-200 rounded-2xl shadow-xl shadow-indigo-200">
      <img
        src={currentBlink?.icon || ""}
        alt=""
        className="w-[400px] rounded-2xl object-contain aspect-square border border-neutral-100"
      />
      <div className="w-full flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className=" flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row justify-start items-center gap-2">
                <div>
                  {true ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.52226 3.58715C9.32033 2.49138 10.5575 1.75 12 1.75C13.4403 1.75 14.6845 2.48956 15.4858 3.5867C16.8268 3.37709 18.2319 3.73232 19.2498 4.75021C20.2684 5.76882 20.6234 7.17516 20.4129 8.51702C21.507 9.31924 22.25 10.5556 22.25 12C22.25 13.4444 21.507 14.6808 20.4129 15.483C20.6234 16.8248 20.2684 18.2312 19.2498 19.2498C18.229 20.2706 16.8235 20.6154 15.4879 20.4105C14.6867 21.5092 13.4415 22.25 12 22.25C10.5544 22.25 9.31711 21.5058 8.51495 20.41C7.1785 20.6159 5.77173 20.2713 4.75021 19.2498C3.72908 18.2287 3.38355 16.8214 3.59556 15.483C2.50171 14.6824 1.75 13.4474 1.75 12C1.75 10.5526 2.50171 9.31757 3.59556 8.51703C3.38355 7.17856 3.72908 5.77134 4.75021 4.75021C5.76978 3.73064 7.17649 3.37685 8.52226 3.58715ZM15.5639 10.6808C16.02 10.3694 16.1373 9.74715 15.8258 9.29106C15.5144 8.83497 14.8922 8.71771 14.4361 9.02915L14.3493 9.08844C12.9756 10.0265 11.7852 11.2023 10.8323 12.5572L9.70673 11.4328C9.316 11.0425 8.68283 11.0428 8.29252 11.4335C7.9022 11.8243 7.90254 12.4574 8.29327 12.8477L10.3 14.8523C10.5204 15.0725 10.8308 15.1774 11.1396 15.136C11.4483 15.0946 11.7202 14.9117 11.8748 14.6413C12.7648 13.085 13.9965 11.7511 15.4771 10.7401L15.5639 10.6808Z"
                        fill="#EAC800"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#D8000C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke-width="2"
                    >
                      <path d="M12 13V8m0 8.375v.001M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-2">
              <h3 className="font-semibold text-2xl font-inter">
                {currentBlink?.title}
              </h3>
              <p className="font-inter text-sm font-medium text-black opacity-60">
                {currentBlink?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 border border-black border-opacity-10 p-4 rounded-xl">
          {currentBlink?.links?.actions?.some(
            (action) => !action.parameters,
          ) && (
            <div className="flex mb-4 flex-wrap">
              {currentBlink.links.actions.map((action, index) => {
                if (!action.parameters) {
                  return (
                    <RenderMultipleButtons
                      key={index}
                      action={action}
                      disabled={currentBlink.disabled ?? false}
                      count={
                        currentBlink.links?.actions?.filter(
                          (action) => !action.parameters,
                        ).length || 0
                      }
                      link="https://buythedip.trade"
                    />
                  );
                }
                return null;
              })}
            </div>
          )}
          {currentBlink?.links ? (
            <div className="flex flex-col gap-4">
              {currentBlink.links.actions.map((action, index) =>
                action.parameters ? (
                  <RenderInputs
                    key={index}
                    action={action}
                    disabled={currentBlink.disabled ?? false}
                    link={"https://buythedip.trade"}
                  />
                ) : null,
              )}
            </div>
          ) : (
            <RenderSingleButton
              blink={currentBlink!}
              link={"https://buythedip.trade"}
              disabled={currentBlink?.disabled ?? false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
