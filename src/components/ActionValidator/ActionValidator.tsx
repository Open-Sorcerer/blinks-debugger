import { Validations } from "@/types/common";
import { FaCircleCheck, FaRegCircleXmark } from "react-icons/fa6";

interface ActionValidatorProps {
  ActionsValidations: Validations;
}

export default function ActionValidator({
  ActionsValidations: {
    isActionsJsonValid,
    isGetResponseValid,
    isOptionsResultValid,
    isPostResultValid,
    isOGImageValid,
    isCORSEnabled,
  },
}: ActionValidatorProps) {
  function getIcon(isValid: boolean) {
    return isValid ? (
      <FaCircleCheck size={20} className="text-emerald-500" />
    ) : (
      <FaRegCircleXmark size={20} className="text-red-500" />
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        {getIcon(isActionsJsonValid)} actions.json
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        {getIcon(isOptionsResultValid)} options
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        {getIcon(isOGImageValid)} Image URL
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        {getIcon(isGetResponseValid)} Get Response
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        {getIcon(isPostResultValid)} POST Response
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        {getIcon(isCORSEnabled)} CORS Enabled
      </span>
    </div>
  );
}
