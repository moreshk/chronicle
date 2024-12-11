import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Keypair,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    ExtensionType,
    getMintLen,
    LENGTH_SIZE,
    TOKEN_2022_PROGRAM_ID,
    TYPE_SIZE,
} from "@solana/spl-token";
import type { TokenMetadata } from "@solana/spl-token-metadata";
import {
    createInitializeInstruction,
    pack,
    createUpdateFieldInstruction,
} from "@solana/spl-token-metadata";

const CreateToken = () => {
    const { publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: string | null; message: string }>({ type: null, message: "" });

    const handleCreateToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!publicKey || !signTransaction) {
            setStatus({
                type: "error",
                message: "Please connect your wallet",
            });
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: "" });

        try {
            const mint = Keypair.generate();
            const decimals = 9;

            const metadata: TokenMetadata = {
                mint: mint.publicKey,
                name: tokenName,
                symbol: tokenSymbol,
                uri: "",
                additionalMetadata: [["description", tokenDescription]],
            };

            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

            const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
            const mintTransaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: mintLen,
                    lamports: mintLamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(
                    mint.publicKey,
                    publicKey,
                    mint.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
                createInitializeMintInstruction(mint.publicKey, decimals, publicKey, null, TOKEN_2022_PROGRAM_ID),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mint.publicKey,
                    metadata: mint.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: publicKey,
                    updateAuthority: publicKey,
                }),
                createUpdateFieldInstruction({
                    metadata: mint.publicKey,
                    updateAuthority: publicKey,
                    programId: TOKEN_2022_PROGRAM_ID,
                    field: metadata.additionalMetadata[0][0],
                    value: metadata.additionalMetadata[0][1],
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            mintTransaction.recentBlockhash = blockhash;
            mintTransaction.feePayer = publicKey;

            mintTransaction.partialSign(mint);

            const signedTransaction = await signTransaction(mintTransaction);

            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
            await connection.confirmTransaction(signature);

            setStatus({
                type: "success",
                message: `Token created successfully! Mint address: ${mint.publicKey.toString()}`,
            });
        } catch (error) {
            console.error("Error creating token:", error);
            setStatus({
                type: "error",
                message: "Failed to create token. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleCreateToken} className="w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tokenName">
                        Token Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="tokenName"
                        type="text"
                        placeholder="Enter token name"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tokenSymbol">
                        Token Symbol
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="tokenSymbol"
                        type="text"
                        placeholder="Enter token symbol"
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tokenDescription">
                        Token Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="tokenDescription"
                        placeholder="Enter token description"
                        value={tokenDescription}
                        onChange={(e) => setTokenDescription(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Token
                </button>
            </form>
            {status.type && (
                <div
                    className={`mt-4 p-2 rounded ${
                        status.type === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default CreateToken; 