import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MINTING_PROGRAM_ID = 'YOUR_MINTING_PROGRAM_PUBLIC_KEY'; // Replace with your minting program public key
const CONNECTION_URL = 'https://api.devnet.solana.com'; // Connection URL for Solana Devnet

const MintingCard = () => {
    const { publicKey, sendTransaction } = useWallet();
    const [displayPublicKey, setDisplayPublicKey] = useState('brt65...456br');
    const [payerPublicKey, setPayerPublicKey] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [hasPaid, setHasPaid] = useState<boolean>(false);
    const connection = new Connection(CONNECTION_URL, 'confirmed'); // Create connection to Solana network

    useEffect(() => {
        const storedPublicKey = localStorage.getItem('payerPublicKey');
        const storedTimeLeft = localStorage.getItem('timeLeft');

        if (storedPublicKey) {
            setPayerPublicKey(storedPublicKey);
            setDisplayPublicKey(storedPublicKey);
            setHasPaid(true);
        }

        if (storedTimeLeft) {
            setTimeLeft(Number(storedTimeLeft));
            startTimer(Number(storedTimeLeft));
        }
    }, []);

    useEffect(() => {
        if (payerPublicKey) {
            setDisplayPublicKey(`${payerPublicKey.slice(0, 4)}...${payerPublicKey.slice(-4)}`);
        }
    }, [payerPublicKey]);

    useEffect(() => {
        localStorage.setItem('timeLeft', timeLeft.toString());
    }, [timeLeft]);

    const startTimer = (initialTime: number) => {
        setTimeLeft(initialTime);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1; // Decrease timer by 1 second
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    };

    const handleMint = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!publicKey) {
            toast.error("Please connect your wallet");
            return;
        }
    
        if (hasPaid) {
            toast.error("You have already paid.");
            return;
        }
    
        const mintAmount = 0.32; // Amount to pay in SOL
        const lamports = mintAmount * 1e9; // Convert SOL to lamports
    
        try {
            const balance = await connection.getBalance(publicKey);
            console.log(`Wallet balance: ${balance / 1e9} SOL`); // Log wallet balance
            if (balance < lamports) {
                toast.error("Insufficient funds in your wallet.");
                return;
            }
    
            // Validate the minting program ID
            let mintingPubKey;
            try {
                mintingPubKey = new PublicKey(MINTING_PROGRAM_ID);
            } catch (error) {
                console.error("Invalid minting program public key:", error.message);
                toast.error("Invalid minting program public key.");
                return;
            }
    
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: mintingPubKey,
                    lamports: lamports,
                })
            );
    
            // Set the transaction fee payer and recent blockhash
            transaction.feePayer = publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
            // Send the transaction
            const signature = await sendTransaction(transaction, connection);
            await sendAndConfirmTransaction(connection, signature, {
                commitment: 'confirmed',
            });
    
            // Update payer's public key and mark as paid
            setPayerPublicKey(publicKey.toBase58());
            setHasPaid(true);
            localStorage.setItem('payerPublicKey', publicKey.toBase58());
            startTimer(18 * 60 * 60); // Start timer for 18 hours in seconds
    
            toast.success(`Successfully minted! You paid ${mintAmount} SOL.`);
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Failed to mint. Please try again.");
                console.error("Transaction error:", error.message, error);
            } else {
                toast.error("An unexpected error occurred.");
                console.error("Unexpected error:", error);
            }
        }
    };
    
    

    const formatTimeLeft = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')} hrs ${String(minutes).padStart(2, '0')} min ${String(secs).padStart(2, '0')} sec left`;
    };

    return (
        <div className="bg-white shadow-lg rounded-xl md:w-[22vw] ">
            <div className="h-[40vh] pt-5 rounded-xl relative">
                <iframe
                    src="https://giphy.com/embed/prhu1VNvjvJQNaJnEc"
                    title="Giphy Embed"
                    width="100%"
                    height="100%"
                    className="pointer-events-none"
                ></iframe>
                <div className="absolute inset-0"></div>
            </div>
            <div className="flex flex-col gap-2 p-5">
                <p className='font-bold text-md text-black'>Mint the master key to win a Prize Poll of $30,000</p>
                <p className='text-md text-gray-700'>{hasPaid ? formatTimeLeft(timeLeft) : `18 hrs 19 min left ${displayPublicKey} to win`}</p>
                <form onSubmit={handleMint}>
                    <button className='w-full font-bold text-md h-8 text-white bg-black rounded-md'>Mint for 0.32 SOL</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MintingCard;
