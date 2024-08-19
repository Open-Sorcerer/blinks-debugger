"use server";

import {
  BlinkTransaction,
  ChessApiResponse,
  Cluster,
  SimulationResult,
} from "@/types/blink/Metadata";
import {
  Connection,
  PublicKey,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  Transaction,
  VersionedMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  fetchRelevantAddresses,
  getTransactionDataFromUserSuppliedBytes,
} from "../../utils/simulation/versionedTx";

export async function fetchBlinkMetadata(
  blinkURL: string
): Promise<ChessApiResponse | null> {
  try {
    const response = await fetch(blinkURL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as ChessApiResponse;
  } catch (error) {
    console.error("Error fetching blink metadata:", error);
    return null;
  }
}

export async function fetchTransaction(
  blinkURL: string,
  address: string
): Promise<BlinkTransaction | null> {
  try {
    const response = await fetch(blinkURL, {
      method: "POST",
      body: JSON.stringify({ account: address }),
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as BlinkTransaction;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
}

export async function simulateTransaction(
  encodedTransaction: string,
  cluster: Cluster
): Promise<SimulationResult> {
  try {
    const connection = new Connection(
      cluster === Cluster.MainnetBeta
        ? "https://api.mainnet-beta.solana.com"
        : "https://api.devnet.solana.com",
      "confirmed"
    );

    const decodedTransaction = Buffer.from(encodedTransaction, "base64");

    let simulationResponse: RpcResponseAndContext<SimulatedTransactionResponse>;
    let accounts: PublicKey[];
    let signers: string[];
    let transactionData:
      | {
          message: VersionedMessage;
          rawMessage: Uint8Array;
          signatures?: string[];
        }
      | undefined;

    try {
      const buffer = Uint8Array.from(atob(encodedTransaction), (c) =>
        c.charCodeAt(0)
      );
      transactionData = getTransactionDataFromUserSuppliedBytes(buffer);

      const message = VersionedMessage.deserialize(transactionData.rawMessage);

      const transaction = new VersionedTransaction(transactionData.message);

      simulationResponse = await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true,
      });

      const relevantIndexes = new Set<number>();
      const addressTableLookupKeys = message.addressTableLookups.map(
        (lookup) => new PublicKey(lookup.accountKey)
      );

      message.addressTableLookups.forEach((lookup) => {
        lookup.writableIndexes.forEach((index) => relevantIndexes.add(index));
        lookup.readonlyIndexes.forEach((index) => relevantIndexes.add(index));
      });

      const lookupTableAccounts = await fetchRelevantAddresses(
        connection,
        addressTableLookupKeys,
        relevantIndexes
      );
      accounts = [...message.staticAccountKeys, ...lookupTableAccounts];
      signers = accounts
        .slice(0, message.header.numRequiredSignatures)
        .map((signer) => signer.toBase58());
    } catch (versionedError) {
      console.log("Falling back to Legacy Transaction", versionedError);

      const transaction = Transaction.from(decodedTransaction);
      simulationResponse = await connection.simulateTransaction(transaction);

      const message = transaction.compileMessage();
      accounts = message.accountKeys;
      signers = accounts
        .slice(0, message.header.numRequiredSignatures)
        .map((signer) => signer.toBase58());
    }

    const simulation = simulationResponse.value;

    if (simulation.err) {
      return {
        success: false,
        error: JSON.stringify(simulation.err),
        accounts: accounts.map((acc) => acc.toBase58()),
        signers,
      };
    }

    return {
      success: true,
      accounts: accounts.map((acc) => acc.toBase58()),
      logs: simulation.logs,
      unitsConsumed: simulation.unitsConsumed,
      signers,
    };
  } catch (error) {
    console.error("Error in simulateTransaction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      signers: [],
    };
  }
}
