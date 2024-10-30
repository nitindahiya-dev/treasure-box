// global.d.ts
declare module "clsx" {
    export type ClassValue = string | number | null | undefined | ClassValue[];
    export default function clsx(...inputs: ClassValue[]): string;
  }
  
  declare module "tailwind-merge" {
    export function twMerge(...classNames: string[]): string;
  }
  

  declare module '@solana/wallet-adapter-react';
declare module '@solana/wallet-adapter-wallets';
declare module '@solana/wallet-adapter-react-ui';
