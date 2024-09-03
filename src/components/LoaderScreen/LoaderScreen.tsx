export default function LoaderScreen({
  isFullScreen = false,
}: {
  isFullScreen?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center ${isFullScreen ? "min-h-screen" : "mt-6"}`}
    >
      <div
        className="mx-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-indigo-500"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
