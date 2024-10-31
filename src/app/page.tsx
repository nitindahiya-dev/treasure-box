"use client";
import React, { useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Vortex } from "@/components/ui/vortex";
import { WalletAdapter } from '@solana/wallet-adapter-base';
import MintingCard from '@/components/MintingCard';

const Page = () => {
  const network = "devnet"; // Solana network configuration
  const endpoint = clusterApiUrl(network);

  const [wallets, setWallets] = useState<WalletAdapter[]>([]);

  // Setting up wallet adapters using useEffect
  useEffect(() => {
    const setupWallets = () => {
      setWallets([
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
      ]);
    };

    setupWallets();
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Vortex
            backgroundColor="black"
            className="mx-auto rounded-md min-h-screen overflow-hidden flex items-center flex-col justify-between px-2 md:px-10 py-6"
          >
            {/* Navbar component */}
            <Navbar />

            {/* Share link button */}
            <span className="font-bold text-lg bg-white rounded-md w-40 flex items-center justify-center gap-3 px-5 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
              Share link
            </span>

            {/* Minting card component */}
            <MintingCard />

            {/* Footer component */}
            <Footer />
          </Vortex>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Page;
