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

export interface AccountInfoObject {
  index: number;
  pubkey: PublicKey | string;
  accountInfo: AccountInfo[];
}

export interface AccountInfo {
  friendlyName?: string;
  abbreviation?: string;
  category?: string;
  network?: string;
  tags?: [];
  logoURI?: string | null;
  flag?: string | null;
}

export interface SimulationResult {
  success: boolean;
  error?: string;
  accounts: Array<AccountInfoObject> | null;
  logs?: string[] | null;
  unitsConsumed?: number | null;
  signatureDetails: Array<SignatureDetails>;
}

export interface SignatureDetails {
  signature: string;
  signer: string;
  validity: "Valid" | "Invalid";
  details: string;
}
