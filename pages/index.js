import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import Header from "@/components/Header";

export default function Home() {
  const [amountToSend, setAmountToSend] = useState(0); // in lamports so * LAMPORTS_PER_SOL to get SOL
  const [recipientAddress, setRecipientAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [transactionSignature, setTransactionSignature] = useState("");

  useEffect(() => {
    // if there is no public key, do nothing
    if (!publicKey) return;

    // get the balance of the account
    connection.getBalance(publicKey).then((balance) => {
      setBalance(balance);
      console.log(publicKey);
    });
  }, [publicKey]);

  const sendSol = async (event) => {
    event.preventDefault();
    if (!publicKey) return;
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new web3.PublicKey(recipientAddress),
        lamports: amountToSend * web3.LAMPORTS_PER_SOL,
      })
    );

    sendTransaction(transaction, connection).then((sig) => {
      setTransactionSignature(sig);
    });
  };

  return (
    <main className={`bg-gray-200 h-screen w-full p-8`}>
      <Header />
      {!publicKey && (
        <div className="p-6 flex flex-col items-center">
          <p className="text-lg">Mint NFTs across 13 chain through chat!</p>
          <p>
            InterPal simplifies NFT minting, coin swaps, and crypto transactions
            with an intuitive chatbot with cross-chain interoperability.
          </p>
        </div>
      )}

      <div className="p-6 flex flex-col items-center">
        <p className="text-lg">Connected: {publicKey ? "true" : "false"}</p>
        <p className="text-lg">
          Balance: {(balance / web3.LAMPORTS_PER_SOL).toFixed(4)} SOL
        </p>
      </div>

      {publicKey && (
        <iframe
          height="100%"
          width="100%"
          src="https://creator.voiceflow.com/prototype/64669b92bf42a20007b01df5"
          title="InterPal"
        ></iframe>
      )}
    </main>
  );
}
