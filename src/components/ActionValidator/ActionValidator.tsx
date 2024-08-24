import { FaCircleCheck, FaRegCircleXmark } from "react-icons/fa6";

export default function ActionValidator() {
  return (
    <div className="flex flex-col gap-2 px-4">
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <FaCircleCheck size={20} className="text-emerald-500" /> actions.json
        file
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <FaCircleCheck size={20} className="text-emerald-500" /> options
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <FaRegCircleXmark size={20} className="text-red-500" /> open graph
        metadata
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <FaCircleCheck size={20} className="text-emerald-500" /> fc: image
      </span>
      <span className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <FaRegCircleXmark size={20} className="text-red-500" /> fc: button
      </span>
    </div>
  );
}
