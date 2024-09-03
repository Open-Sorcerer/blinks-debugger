export default function ConsoleSkeleton() {
  return (
    <div className="flex flex-col gap-2 mt-5 animate-pulse">
      <div className="w-full h-20 bg-indigo-100 rounded-xl"></div>
      <div className="w-full h-20 bg-amber-100 rounded-xl"></div>
      <div className="w-full h-20 bg-cyan-100 rounded-xl"></div>
    </div>
  );
}
