import Home from "@/components/Home/Home";
import LoaderScreen from "@/components/LoaderScreen/LoaderScreen";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LoaderScreen isFullScreen={true} />}>
      <Home />
    </Suspense>
  );
}
