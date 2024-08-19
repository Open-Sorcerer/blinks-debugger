"use server";

import { BlinkTransaction, ChessApiResponse } from "@/types/blink/Metadata";

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
