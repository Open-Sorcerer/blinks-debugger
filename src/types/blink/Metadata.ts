import { PublicKey } from "@solana/web3.js";

export enum Cluster {
  MainnetBeta = "mainnet-beta",
  Devnet = "devnet",
}

export interface ChessApiResponse {
  icon: string;
  title: string;
  label: string;
  description: string;
  links: {
    actions: ChessAction[];
  };
}

interface ChessAction {
  href: string;
  label: string;
  parameters?: ChessActionParameter[];
}

interface ChessActionParameter {
  name: string;
  label: string;
}

export interface BlinkTransaction {
  transaction: string;
  message?: string;
}

export interface SimulationResult {
  success: boolean;
  error?: string;
  accountInfo:
    | Array<{
        index: number;
        pubkey: PublicKey | string;
        accountInfo?: any;
      }>
    | string[];
  logs?: string[] | null;
  unitsConsumed?: number | null;
  signatureDetails: Array<{
    signature: string;
    signer: string;
    validity: "Valid" | "Invalid";
    details: string;
  }>;
}
