import useBlink from "@/hooks/useBlink";
import type { Blink } from "@/types/blink";
import { useEffect, useState } from "react";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
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
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [url]);

  if (isLoading) {
    return <LoaderScreen />;
  }
  return (
    <div className="w-5/6 flex flex-col max-w-6xl bg-white gap-5 p-6 border border-neutral-200 rounded-2xl shadow-xl shadow-indigo-200">
      <img
        src={currentBlink?.icon || "/placeholder.png"}
        alt=""
        className="w-[400px] rounded-2xl object-cover aspect-square border border-neutral-100"
      />
      <div className="w-full flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className=" flex flex-col gap-4">
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
        <div className="mt-4">
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
