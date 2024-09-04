// create conneciton store using zustand

import { Connection } from "@solana/web3.js";
import { create } from "zustand";

interface ConnectionStore {
  connection: Connection;
  setConnection: (type: "devnet" | "mainnet") => void;
  type: "devnet" | "mainnet";
}

const useConnectionStore = create<ConnectionStore>((set) => ({
  connection: new Connection("https://api.devnet.solana.com", "confirmed"),
  setConnection: (type) => {
    set({
      connection: new Connection(
        type === "devnet"
          ? "https://api.devnet.solana.com"
          : "https://api.mainnet-beta.solana.com",
        "confirmed",
      ),
      type,
    });
  },
  type: "mainnet",
}));

export default useConnectionStore;
