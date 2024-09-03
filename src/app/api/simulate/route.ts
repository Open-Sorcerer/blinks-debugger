import { simulateTransaction } from "@/app/_actions";
import { Cluster, SimulationResult } from "@/types/blink";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tx } = await req.json();
  const simulate: SimulationResult = await simulateTransaction(
    tx,
    Cluster.MainnetBeta,
  );

  if (simulate.accounts) {
    for (let index = 0; index < simulate.accounts.length; index++) {
      const accountInfo = simulate.accounts[index];
    }
  }

  return NextResponse.json(simulate);
}
