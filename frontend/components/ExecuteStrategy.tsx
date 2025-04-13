"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { DefaultService } from "@/src/api";

type StrategyItem = {
  protocol: string;
  activity: string;
  token: string;
  allocation_percent: number;
  expected_apy: number;
  estimated_return: number;
  risk_level: string;
  why: string;
};

export default function ExecuteStrategy({ strategy }: { strategy: StrategyItem[] }) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function executeStrategy() {
    try {
      setLoading(true);

      // 1. Connect MetaMask
      const [userAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // 2. Call your backend to generate the tx from Gemini
      const response = await DefaultService.executeStrategyApiStrategyExecutePost(userAddress)

      const txData = await response.json();

      if (txData.error) {
        alert("Backend Error: " + txData.error);
        setLoading(false);
        return;
      }

      // 3. Send tx via MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: txData.to,
        data: txData.data,
        value: txData.value ?? "0x0",
        gasLimit: txData.gas ? ethers.toBigInt(txData.gas) : undefined,
        gasPrice: txData.gasPrice ? ethers.toBigInt(txData.gasPrice) : undefined,
      });

      setTxHash(tx.hash);
      await tx.wait();

      alert("Transaction confirmed!");
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={executeStrategy}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Executing..." : "Execute Strategy via MetaMask"}
      </button>

      {txHash && (
        <p className="mt-3 text-green-600">
          ✅ Transaction sent:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
}
