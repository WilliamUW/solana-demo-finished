import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import dynamic from "next/dynamic";

const Header = () => {
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  return (
    <div className="py-8 px-4 w-full bg-gray-200 border-gray-400 flex flex-col items-center rounded-lg">
      <h1 className="text-2xl font-bold mb-4">InterPal</h1>
      <div className="flex items-center">
        <WalletMultiButtonDynamic />
      </div>
    </div>
  );
};

export default Header;
