import { Action, Blink, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import "@dialectlabs/blinks/index.css";
import { useEffect, useState } from "react";

interface BlinksProps {
  actionUrl: string;
}
const Blinks = ({ actionUrl }: BlinksProps) => {
  const [action, setAction] = useState<Action | null>(null);
  const { adapter } = useActionSolanaWalletAdapter(
    process.env.NEXT_PUBLIC_RPC!,
  );

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const fetchedAction = await Action.fetch(actionUrl);
        console.log({ fetchedAction });
        setAction(fetchedAction);
      } catch {
        setAction(null);
      }
    };
    fetchAction();
  }, [actionUrl]);

  useEffect(() => {
    if (action) {
      action.setAdapter(adapter as any);
    }
  }, [action, adapter]);

  const { isRegistryLoaded } = useActionsRegistryInterval();

  return action && isRegistryLoaded ? (
    <Blink
      stylePreset={"x-dark"}
      action={action}
      websiteText={new URL(actionUrl).hostname}
    />
  ) : null;
};

export default Blinks;
