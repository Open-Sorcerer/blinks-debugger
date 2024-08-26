import {
  AddressLookupTableAccount,
  AddressLookupTableProgram,
  Connection,
  PublicKey,
  VersionedMessage,
} from "@solana/web3.js";
import base58 from "bs58";

export function getMessageDataFromBytes(bytes: Uint8Array): {
  message: VersionedMessage;
  rawMessage: Uint8Array;
} {
  const message = VersionedMessage.deserialize(bytes);
  return {
    message,
    rawMessage: bytes,
  };
}

export function getTransactionDataFromUserSuppliedBytes(bytes: Uint8Array): {
  message: VersionedMessage;
  rawMessage: Uint8Array;
  signatures?: string[];
} {
  /**
   * Step 1: Try to parse the bytes as a *transaction* first (ie. with signatures at the front)
   */
  let offset = 0;
  const numSignatures = bytes[offset++];
  // If this were a transaction, would its message expect exactly `numSignatures`?
  let requiredSignaturesByteOffset = 1 + numSignatures * 64;
  if (
    VersionedMessage.deserializeMessageVersion(
      bytes.slice(requiredSignaturesByteOffset),
    ) !== "legacy"
  ) {
    requiredSignaturesByteOffset++;
  }
  const numRequiredSignaturesAccordingToMessage =
    bytes[requiredSignaturesByteOffset];
  if (numRequiredSignaturesAccordingToMessage !== numSignatures) {
    // We looked ahead into the message and could not match the number of signatures indicated
    // by the first byte of the transaction with the expected number of signatures in the
    // message. This is likely not a transaction at all, so try to parse it as a message now.
    return getMessageDataFromBytes(bytes);
  }
  const signatures = [];
  for (let ii = 0; ii < numSignatures; ii++) {
    const signatureBytes = bytes.subarray(offset, offset + 64);
    if (signatureBytes.length !== 64) {
      // We hit the end of the byte array before consuming `numSignatures` signatures. This
      // can't have been a transaction, so try to parse it as a message now.
      return getMessageDataFromBytes(bytes);
    }
    signatures.push(base58.encode(signatureBytes));
    offset += 64;
  }
  try {
    const transactionData = getMessageDataFromBytes(bytes.slice(offset));
    return {
      ...transactionData,
      ...(signatures.length ? { signatures } : null),
    };
  } catch {
    /**
     * Step 2: That didn't work, so presume that the bytes are a message, as asked for in the UI
     */
    return getMessageDataFromBytes(bytes);
  }
}

export async function fetchRelevantAddresses(
  connection: Connection,
  lookupTableKeys: PublicKey[],
  relevantIndexes: Set<number>,
): Promise<
  Array<{
    index: number;
    pubkey: PublicKey;
    accountInfo?: any;
  }>
> {
  const relevantAddresses: Array<{
    index: number;
    pubkey: PublicKey;
    accountInfo?: any;
  }> = [];

  for (const key of lookupTableKeys) {
    const accountInfo = await connection.getAccountInfo(key);

    if (
      accountInfo?.data &&
      accountInfo.owner.equals(AddressLookupTableProgram.programId)
    ) {
      try {
        const lookupTableAccount = AddressLookupTableAccount.deserialize(
          accountInfo.data,
        );
        if (lookupTableAccount && lookupTableAccount.addresses) {
          const entries = Array.from(lookupTableAccount.addresses.entries());
          for (const [index, address] of entries) {
            if (relevantIndexes.has(index)) {
              relevantAddresses.push({
                index,
                pubkey: address,
              });
            }
          }
        }
      } catch {
        console.error("Failed to deserialize address lookup table account");
      }
    }
  }

  const allAccountKeys = new Set([
    ...relevantAddresses.map((addr) => addr.pubkey.toBase58()),
  ]);

  try {
    const solanaFmResponse = await fetch("https://api.solana.fm/v0/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountHashes: Array.from(allAccountKeys),
        fields: ["data"],
      }),
    });

    if (!solanaFmResponse.ok) {
      throw new Error(
        `Solana FM API response error: ${solanaFmResponse.statusText}`,
      );
    }

    const data = await solanaFmResponse.json();

    const accountData = data.result.reduce(
      (acc: any, item: any) => {
        if (!acc[item.accountHash]) {
          acc[item.accountHash] = [];
        }
        acc[item.accountHash].push(item.data);
        return acc;
      },
      {} as { [key: string]: any[] },
    );

    relevantAddresses.forEach((addr) => {
      const addrString = addr.pubkey.toBase58();
      if (accountData[addrString]) {
        addr.accountInfo = accountData[addrString];
      }
    });
  } catch (error) {
    console.error("Failed to fetch data from Solana FM API", error);
  }

  return relevantAddresses;
}
