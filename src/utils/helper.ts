import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";

async function getRawTransaction(
  encodedTransaction: string,
): Promise<Transaction | VersionedTransaction> {
  let recoveredTransaction: Transaction | VersionedTransaction;
  try {
    recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64"),
    );
  } catch (error) {
    recoveredTransaction = VersionedTransaction.deserialize(
      Buffer.from(encodedTransaction, "base64"),
    );
  }
  return recoveredTransaction;
}

const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed",
);

export { connection, getRawTransaction };
