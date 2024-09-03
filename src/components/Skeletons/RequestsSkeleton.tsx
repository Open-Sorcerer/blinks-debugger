export default function RequestsSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="text-lg text-indigo-500 font-semibold">Get Response</div>
      <div className="w-full h-32 bg-neutral-200 rounded-xl animate-pulse"></div>
      <div className="text-lg text-indigo-500 font-semibold mt-3">
        Post Response
      </div>
      <div className="w-full h-32 bg-neutral-200 rounded-xl animate-pulse"></div>
    </div>
  );
}
