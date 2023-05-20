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
      <div className="p-6">
        <p className="text-lg">Send SOL to anyone on the Solana blockchain.</p>
        {/* show status saying whether the user is connected or not */}
        <p className="text-lg">Connected: {publicKey ? "true" : "false"}</p>

        <p className="text-lg">
          Balance: {(balance / web3.LAMPORTS_PER_SOL).toFixed(4)} SOL
        </p>

        <div className="h-24"></div>

        {/* once the transaction is complete, add a blue popup with a darker blue border that tells the user and lets them view the transaction on solscan */}
        {transactionSignature && (
          <div className="bg-blue-100 border border-blue-400 rounded-lg p-4">
            <p className="text-lg">
              Transaction complete!{" "}
              <a
                className="text-blue-500"
                href={`https://explorer.solana.com/tx/${transactionSignature}`}
                target="_blank"
                rel="noreferrer"
              >
                View on SolScan
              </a>
            </p>
          </div>
        )}

        {/* create a form with an amount of sol to send, address, and confirm button */}
        <form className="flex flex-col space-y-2">
          <label className="text-lg">Amount of SOL to send</label>
          <input
            className="border border-gray-400 rounded-lg p-2"
            type="number"
            placeholder="0.0"
            onChange={(e) => setAmountToSend(e.target.value)}
          />

          <label className="text-lg">Recipient Address</label>
          <input
            className="border border-gray-400 rounded-lg p-2"
            type="text"
            placeholder="Enter a Solana address"
            onChange={(e) => setRecipientAddress(e.target.value)}
          />

          <button
            onClick={(e) => sendSol(e)}
            className="bg-blue-500 text-white rounded-lg p-2 mt-4"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
