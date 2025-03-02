'use client';

import { useState } from 'react';
import BitcoinTransaction from '../components/bitcoin/BitcoinTransaction';
import NearWalletConnector from '../components/near/NearWalletConnector';

export default function BitcoinPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | undefined>(undefined);

  const handleConnect = (connectedAccountId: string) => {
    setIsWalletConnected(true);
    setAccountId(connectedAccountId);
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setAccountId(undefined);
  };

  return (
    <div className="container mx-auto py-8 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Bitcoin Transactions with NEAR Chain Signatures</h1>
      
      <div className="mb-6">
        <p className="text-gray-200 text-lg">
          This page allows you to create Bitcoin transactions that can be signed using NEAR Chain Signatures.
          You can perform standard Bitcoin transfers, etch new Runes, or transfer existing Runes.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-3 text-orange-400">NEAR Wallet Connection</h2>
          <p className="text-gray-300 mb-4">
            Connect your NEAR wallet to derive a Bitcoin address and sign transactions. 
            Your NEAR account will be used to sign Bitcoin transactions through NEAR Chain Signatures.
          </p>
          
          <NearWalletConnector 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isWalletConnected}
            accountId={accountId}
          />
        </div>
        
        {isWalletConnected ? (
          <BitcoinTransaction nearAccountId={accountId} />
        ) : (
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-9a1 1 0 011 1v4a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-300 text-lg mb-2">Wallet not connected</p>
            <p className="text-gray-400">Connect your NEAR wallet to create and sign Bitcoin transactions</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-orange-400">How It Works</h2>
        <p className="mb-4 text-gray-200">
          NEAR Chain Signatures enable NEAR accounts to sign and execute transactions on the Bitcoin blockchain. 
          This allows you to control Bitcoin assets directly from your NEAR account without needing a 
          separate Bitcoin wallet.
        </p>
        <p className="mb-4 text-gray-200">
          The process works by:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-200 mb-4 pl-4">
          <li>Connecting your NEAR wallet</li>
          <li>Deriving a Bitcoin address from your NEAR account using a derivation path</li>
          <li>Creating a Bitcoin transaction (transfer, etch Rune, or transfer Rune)</li>
          <li>Signing the transaction with your NEAR account using Chain Signatures</li>
          <li>Broadcasting the signed transaction to the Bitcoin network</li>
        </ol>
        <p className="text-gray-200">
          For more information, see the <a href="https://docs.near.org/chain-abstraction/chain-signatures" className="text-orange-400 underline hover:text-orange-300 transition-colors" target="_blank" rel="noopener noreferrer">NEAR Chain Signatures documentation</a>.
        </p>
      </div>
    </div>
  );
} 