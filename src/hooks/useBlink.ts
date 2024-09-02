import type { Blink, TransactionData } from "../types/blink";

export default function useBlink() {
  async function fetchBlink(url: string): Promise<Blink> {
    const response = await fetch(url);
    return response.json();
  }

  async function fetchTransaction(
    url: string,
    account: string,
  ): Promise<TransactionData> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account: account }),
    });
    return response.json();
  }
  return { fetchBlink, fetchTransaction };
}
