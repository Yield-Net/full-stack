'use client';

import { useEffect, useState } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from "ethers";
import axios from "axios";

import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DefaultService } from '@/src/api';

export default function LoginPage() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<number | null>(null);

  const router = useRouter(); // Move useRouter here

  useEffect(() => {
    const init = async () => {
      const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
      const web3authInstance = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x5", // Goerli
          rpcTarget: "https://rpc.ankr.com/eth_goerli",
        },
        web3AuthNetwork: process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || "sapphire_devnet",
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || "sapphire_devnet",
          clientId,
        },
      });

      web3authInstance.configureAdapter(openloginAdapter);
      await web3authInstance.initModal();

      setWeb3auth(web3authInstance);
    };

    init();
  }, []);

  const handleLogin = async (wallet: string) => {
    try {
      const response = await DefaultService.loginUserAuthLoginPost({
        wallet_address: wallet,
      });
      console.log("Login response", response);

      setEthBalance(response.balance);

      if (response.hasProfile) {
        router.push('/dashboard');
      } else {

        router.push(`/form?user_id=${response.user_id}`); // Pass userid as a query parameter
      }
    } catch (err) {
      console.error("Backend error", err);
    }
  };

  const loginWithGoogle = async () => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    const ethersProvider = new ethers.BrowserProvider(web3authProvider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    setUserAddress(address);

    await handleLogin(address);
  };

  const loginWithMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];
    setUserAddress(address);

    await handleLogin(address);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <Card className="w-full max-w-md border border-black/10 shadow-none rounded-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-black font-semibold">
            Welcome to <span className="italic text-black">Yield Net</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!userAddress ? (
            <div className="space-y-4">
              <Button
                onClick={loginWithMetaMask}
                className="w-full border border-black text-black bg-transparent hover:bg-black hover:text-white transition"
                variant="ghost"
              >
                Login with MetaMask
              </Button>

              <Separator className="bg-black/10" />

              <Button
                onClick={loginWithGoogle}
                className="w-full border border-black text-black bg-transparent hover:bg-black hover:text-white transition"
                variant="ghost"
              >
                Login with Google (Web3Auth)
              </Button>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-black">
              <p>
                <span className="font-medium">Wallet:</span> {userAddress}
              </p>
              <p>
                <span className="font-medium">Goerli ETH Balance:</span>{' '}
                {ethBalance !== null ? `${ethBalance} ETH` : 'Loading...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
