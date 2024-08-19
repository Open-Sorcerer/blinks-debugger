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
  tx: string;
  message?: string;
}

export interface SimulationResult {
  success: boolean;
  error?: string;
  accounts?: String[];
  logs?: Array<string> | null;
  unitsConsumed?: number;
  signers?: string[];
}
