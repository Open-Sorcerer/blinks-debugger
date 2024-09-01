"use server";

import {
  AccountInfo,
  AccountInfoObject,
  BlinkTransaction,
  ChessApiResponse,
  Cluster,
  SimulationResult,
} from "@/types/blink";
import {
  Connection,
  PublicKey,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  Transaction,
  VersionedMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  fetchRelevantAddresses,
  getTransactionDataFromUserSuppliedBytes,
} from "../../utils/simulation/versionedTx";

export async function fetchBlinkMetadata(
  blinkURL: string,
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
  address: string,
): Promise<BlinkTransaction | null> {
  try {
    console.log("fetching transaction", blinkURL, address);
    const response = await fetch(blinkURL, {
      method: "POST",
      body: JSON.stringify({ account: address }),
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blinkTxn = await response.json();
    return blinkTxn;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
}

export async function simulateTransaction(
  encodedTransaction: string,
  cluster: Cluster,
): Promise<SimulationResult> {
  console.log("encodedTransaction", encodedTransaction);
  try {
    const connection = new Connection(
      cluster === Cluster.MainnetBeta
        ? "https://api.mainnet-beta.solana.com"
        : "https://api.devnet.solana.com",
      "confirmed",
    );

    const decodedTransaction = Buffer.from(encodedTransaction, "base64");

    let simulationResponse: RpcResponseAndContext<SimulatedTransactionResponse>;
    let accountInfo: Array<{
      index: number;
      pubkey: PublicKey;
      accountInfo?: AccountInfo[] | null;
    }> = [];
    let transactionData:
      | {
          message: VersionedMessage;
          rawMessage: Uint8Array;
          signatures?: string[];
        }
      | undefined;

    let signatureDetails: Array<{
      signature: string;
      signer: string;
      validity: "Valid" | "Invalid";
      details: string;
    }> = [];

    try {
      const buffer = Uint8Array.from(atob(encodedTransaction), (c) =>
        c.charCodeAt(0),
      );
      transactionData = getTransactionDataFromUserSuppliedBytes(buffer);

      const message = VersionedMessage.deserialize(transactionData.rawMessage);

      const transaction = new VersionedTransaction(transactionData.message);

      simulationResponse = await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true,
      });

      const relevantIndexes = new Set<number>();
      const addressTableLookupKeys = message.addressTableLookups.map(
        (lookup) => new PublicKey(lookup.accountKey),
      );

      message.addressTableLookups.forEach((lookup) => {
        lookup.writableIndexes.forEach((index) => relevantIndexes.add(index));
        lookup.readonlyIndexes.forEach((index) => relevantIndexes.add(index));
      });

      const lookupTableAccounts = await fetchRelevantAddresses(
        connection,
        addressTableLookupKeys,
        relevantIndexes,
      );

      accountInfo = [
        ...message.staticAccountKeys.map((pubkey, index) => ({
          index,
          pubkey,
          accountInfo: null,
        })),
        ...lookupTableAccounts,
      ];

      const signers = accountInfo
        .slice(0, message.header.numRequiredSignatures)
        .map((info) => info.pubkey.toBase58());

      transactionData.signatures?.forEach((signature, index) => {
        const signer = signers[index];
        signatureDetails.push({
          signature,
          signer,
          validity:
            signature !== bs58.encode(Buffer.alloc(64)) ? "Valid" : "Invalid",
          details: index === 0 ? "Fee Payer" : "Signer",
        });
      });
    } catch (versionedError) {
      console.log("Falling back to Legacy Transaction", versionedError);

      const transaction = Transaction.from(decodedTransaction);
      simulationResponse = await connection.simulateTransaction(transaction);

      const message = transaction.compileMessage();
      accountInfo = message.accountKeys.map((pubkey, index) => ({
        index,
        pubkey,
        accountInfo: accountInfo.find((info) => info.pubkey.equals(pubkey))
          ?.accountInfo,
      }));

      const signers = accountInfo
        .slice(0, message.header.numRequiredSignatures)
        .map((info) => info.pubkey.toBase58());

      transaction.signatures.forEach((signatureObj, index) => {
        const signature = signatureObj.signature;
        const signer = signers[index];
        signatureDetails.push({
          signature: signature?.toString() || "No Signature",
          signer,
          validity: signature ? "Valid" : "Invalid",
          details: index === 0 ? "Fee Payer" : "Signer",
        });
      });
    }

    const simulation = simulationResponse.value;

    if (simulation.err) {
      return {
        success: false,
        error: JSON.stringify(simulation.err),
        accounts: accountInfo.map((info) => ({
          index: info.index,
          pubkey: info.pubkey.toBase58(),
          accountInfo: info.accountInfo,
        })) as AccountInfoObject[],
        signatureDetails,
      };
    }

    return {
      success: true,
      accounts: accountInfo.map((info) => ({
        index: info.index,
        pubkey: info.pubkey.toBase58(),
        accountInfo: info.accountInfo,
      })) as AccountInfoObject[],
      logs: simulation.logs,
      unitsConsumed: simulation.unitsConsumed,
      signatureDetails,
    };
  } catch (error) {
    console.error("Error in simulateTransaction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      accounts: [],
      signatureDetails: [],
    };
  }
}
