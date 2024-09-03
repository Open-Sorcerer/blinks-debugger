import { Action, Blink, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import "@dialectlabs/blinks/index.css";
import { memo, useEffect, useState } from "react";

interface BlinkPreviewProps {
  actionUrl: string;
}
function BlinkPreview({ actionUrl }: BlinkPreviewProps) {
  const [action, setAction] = useState<Action | null>(null);
  const { adapter } = useActionSolanaWalletAdapter(
    process.env.NEXT_PUBLIC_RPC!,
  );

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const fetchedAction = await Action.fetch(actionUrl);
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
    <Blink action={action} websiteText={new URL(actionUrl).hostname} />
  ) : null;
}

export default memo(BlinkPreview);
