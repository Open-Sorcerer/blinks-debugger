import { simulateTransaction } from "@/app/_actions";
import { Cluster, SimulationResult } from "@/types/blink/Metadata";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tx } = await req.json();
  const simulate: SimulationResult = await simulateTransaction(
    tx,
    Cluster.MainnetBeta,
  );

  for (let index = 0; index < simulate.accounts.length; index++) {
    const accountInfo = simulate.accounts[index];

    console.log("accountInfo", accountInfo.accountInfo);
  }

  return NextResponse.json(simulate);
}
