import Link from 'next/link';
import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const Navbar = () => {
  return (
    <div className='flex justify-between items-center w-[80vw] mx-auto h-16 rounded-full px-5 backdrop-blur-lg bg-white/10 shadow-lg'>
      <span className='text-white font-bold text-xl'>Treasure Box</span>
      <div className="flex items-center gap-4">
        <Link
          href={"https://solana-tools-xi.vercel.app/"}
          className="whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 px-4 py-2 bg-black text-white w-max gap-0.5 flex items-center justify-center rounded-full hover:bg-dark-4"
        >
          Home
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-full"
          >
            <path
              d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
        {/* Wallet Connect Button */}

        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Navbar;
