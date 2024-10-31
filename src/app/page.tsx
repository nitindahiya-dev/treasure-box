"use client";
import React, { useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Vortex } from "@/components/ui/vortex";
import MintingCard from '@/components/MintingCard';
import { toast } from 'react-toastify'; // Import toast from react-toastify

// Import Wallet Adapter types
import type { Wallet } from '@solana/wallet-adapter-base';

const Page = () => {
  const network = "devnet"; // Solana network configuration
  const endpoint = clusterApiUrl(network);

  // Explicitly type the wallets state
  const [wallets, setWallets] = useState<Wallet[]>([]); 

  useEffect(() => {
    const setupWallets = () => {
      setWallets([
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
      ]);
    };

    setupWallets();
  }, [network]);

  // Function to handle share link click
  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href); // Copy current URL to clipboard
      toast.success("Link copied!"); // Show success toast
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link."); // Show error toast if copying fails
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Vortex
            backgroundColor="black"
            className="mx-auto rounded-md min-h-screen overflow-hidden flex items-center flex-col justify-between px-2 md:px-10 py-6"
          >
            <Navbar />
            <span 
              className="font-bold text-lg bg-white rounded-md w-40 flex items-center justify-center gap-3 px-5 py-2 cursor-pointer"
              onClick={handleShareLink} // Add click handler
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
              Share link
            </span>
            <MintingCard />
            <Footer />
          </Vortex>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Page;
