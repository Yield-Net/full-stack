'use client';

import { useEffect, useState } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from "ethers";
import axios from "axios";

export default function LoginPage() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);

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
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        wallet_address: wallet,
      });

      setEthBalance(response.data.balance);
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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Yield Net</h1>
      {!userAddress ? (
        <>
          <button onClick={loginWithMetaMask} style={{ marginBottom: '1rem' }}>
            Login with MetaMask
          </button>
          <br />
          <button onClick={loginWithGoogle}>
            Login with Google (Web3Auth)
          </button>
        </>
      ) : (
        <>
          <p><strong>Wallet:</strong> {userAddress}</p>
          <p><strong>Goerli ETH Balance:</strong> {ethBalance ?? 'Loading...'}</p>
        </>
      )}
    </div>
  );
}
