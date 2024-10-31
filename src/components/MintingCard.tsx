import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";


const MINTING_PROGRAM_ID = 'FGZD1wZxBxJSfT13Qi8kPSJ1HgrKZKzL7rFvonswjxwQ';
const CONNECTION_URL = 'https://api.devnet.solana.com';

const MintingCard = () => {
    const { publicKey, sendTransaction } = useWallet();
    const [displayPublicKey, setDisplayPublicKey] = useState<string>('brt65...456br');
    const [payerPublicKey, setPayerPublicKey] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [hasPaid, setHasPaid] = useState<boolean>(false);
    const connection = new Connection(CONNECTION_URL, 'confirmed');

    useEffect(() => {
        const storedPublicKey = localStorage.getItem('payerPublicKey');
        const storedTimeLeft = localStorage.getItem('timeLeft');

        if (storedPublicKey) {
            setPayerPublicKey(storedPublicKey);
            setDisplayPublicKey(storedPublicKey);
            setHasPaid(true);
        }

        if (storedTimeLeft) {
            const remainingTime = Number(storedTimeLeft);
            setTimeLeft(remainingTime);
            startTimer(remainingTime);
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
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
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
    
        const mintAmount = 0.32; // Amount in SOL
        const lamports = BigInt(mintAmount * 1e9); // Convert SOL to Lamports
        console.log(`Mint Amount in Lamports: ${lamports}`);
    
        try {
            const balance = await connection.getBalance(publicKey);
            console.log(`Wallet Balance: ${balance} Lamports`);
    
            // Fetch latest blockhash
            const latestBlockhash = await connection.getLatestBlockhash();
            
            // Approximate fee calculation based on typical values
            const approxTransactionFee = 5000; // Estimate for a typical transaction fee (adjust based on network)
            const totalAmount = lamports + BigInt(approxTransactionFee); // Total amount including fee
    
            if (balance < Number(totalAmount)) {
                toast.error("Insufficient funds in your wallet, including transaction fees.");
                return;
            }
    
            const mintingPubKey = new PublicKey(MINTING_PROGRAM_ID);
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: mintingPubKey,
                    lamports: Number(lamports),
                })
            );
    
            transaction.feePayer = publicKey;
            transaction.recentBlockhash = latestBlockhash.blockhash;
            transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
    
            console.log("Simulating transaction...");
            const simulationResult = await connection.simulateTransaction(transaction);
    
            console.log("Simulation Result:", simulationResult);
            if (simulationResult.value.err) {
                let errorMessage = "Transaction simulation failed";
                errorMessage = `Instruction Error: ${JSON.stringify(simulationResult.value.err)}`;
    
                console.error("Simulation error:", errorMessage);
                toast.error(errorMessage);
                return;
            }
    
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction({
                signature,
                blockhash: transaction.recentBlockhash,
                lastValidBlockHeight: transaction.lastValidBlockHeight,
            });
    
            setPayerPublicKey(publicKey.toBase58());
            setHasPaid(true);
            localStorage.setItem('payerPublicKey', publicKey.toBase58());
            startTimer(18 * 60 * 60); // 18 hours in seconds
    
            toast.success(`Successfully minted! You paid ${mintAmount} SOL.`);
        } catch (error) {
            handleError(error);
        }
    };
    
    const handleError = (error: unknown) => {
        if (error instanceof Error) {
            console.error("Transaction error:", error.message);
            toast.error("Failed to mint. Please try again.");
        } else {
            toast.error("An unexpected error occurred.");
            console.error("Unexpected error:", error);
        }
    };
    
    const formatTimeLeft = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')} hrs ${String(minutes).padStart(2, '0')} min ${String(secs).padStart(2, '0')} sec left`;
    };
    
    

    return (
        <div className="bg-white shadow-lg rounded-xl md:w-[22vw]">
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
                    <button type="submit" className='w-full font-bold text-md h-8 text-white bg-black rounded-md'>Mint for 0.32 SOL</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MintingCard;
