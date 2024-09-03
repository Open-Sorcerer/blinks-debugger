export default function ActionValidatorSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 animate-pulse">
      <div className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <span className="w-6 h-6 bg-amber-100 rounded-full"></span>
        <span className="w-2/6 h-6 bg-neutral-200 rounded-xl"></span>
      </div>
      <div className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <span className="w-6 h-6 bg-red-100 rounded-full"></span>
        <span className="w-2/4 h-6 bg-neutral-200 rounded-xl"></span>
      </div>
      <div className="flex items-center gap-4 border-b border-neutral-200/60 text-neutral-700 py-2">
        <span className="w-6 h-6 bg-green-100 rounded-full"></span>
        <span className="w-2/5 h-6 bg-neutral-200 rounded-xl"></span>
      </div>
    </div>
  );
}
