'use client';

import { useState, useEffect } from 'react';
import { deriveAddressFromNearAccount } from '@/app/services/bitcoinChainSignatures';
import { ACCOUNT_ID } from '@/app/config';
import TransactionSigner from './TransactionSigner';

interface BitcoinTransactionProps {
  onTransactionCreated?: (transactionPayload: any) => void;
  nearAccountId?: string;
}

export default function BitcoinTransaction({ onTransactionCreated, nearAccountId }: BitcoinTransactionProps) {
  // Transaction form state
  const [action, setAction] = useState<'transfer' | 'etch_rune' | 'transfer_rune'>('transfer');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('0.0001');
  const [derivationPath, setDerivationPath] = useState('bitcoin-1');
  const [runeTicker, setRuneTicker] = useState('');
  const [runeAmount, setRuneAmount] = useState('1000');
  const [runeDecimals, setRuneDecimals] = useState('0');
  const [runeMintHeight, setRuneMintHeight] = useState('840000');
  
  // Derived Bitcoin address state
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [bitcoinPublicKey, setBitcoinPublicKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionPayload, setTransactionPayload] = useState<any>(null);
  const [error, setError] = useState('');
  const [signedTransaction, setSignedTransaction] = useState<any>(null);
  
  // Use the provided nearAccountId or fall back to the config value
  const accountId = nearAccountId || ACCOUNT_ID;
  
  // Derive Bitcoin address from NEAR account on component mount or when accountId changes
  useEffect(() => {
    async function fetchAddress() {
      if (!accountId) return;
      
      try {
        setIsLoading(true);
        const { address, publicKey } = await deriveAddressFromNearAccount(accountId, derivationPath);
        setBitcoinAddress(address);
        setBitcoinPublicKey(publicKey);
      } catch (err) {
        console.error('Error deriving Bitcoin address:', err);
        setError('Failed to derive Bitcoin address');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAddress();
  }, [accountId, derivationPath]);
  
  // Update address when derivation path changes
  useEffect(() => {
    async function updateAddress() {
      if (!accountId) return;
      
      try {
        const { address, publicKey } = await deriveAddressFromNearAccount(accountId, derivationPath);
        setBitcoinAddress(address);
        setBitcoinPublicKey(publicKey);
      } catch (err) {
        console.error('Error updating Bitcoin address:', err);
      }
    }
    
    updateAddress();
  }, [accountId, derivationPath]);
  
  async function createTransaction() {
    setIsLoading(true);
    setError('');
    setTransactionPayload(null);
    setSignedTransaction(null);
    
    try {
      // Build URL with query parameters based on the selected action
      let url = `/api/tools/bitcoin-transaction?action=${action}&receiver=${receiver}&derivationPath=${derivationPath}`;
      
      // Add the accountId to the request if it's provided
      if (accountId) {
        url += `&accountId=${encodeURIComponent(accountId)}`;
      }
      
      if (action === 'transfer' || action === 'transfer_rune') {
        url += `&amount=${amount}`;
      }
      
      if (action === 'etch_rune') {
        url += `&runeTicker=${runeTicker}&runeDecimals=${runeDecimals}&runeMintHeight=${runeMintHeight}`;
      }
      
      if (action === 'transfer_rune') {
        url += `&runeTicker=${runeTicker}&runeAmount=${runeAmount}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create transaction');
      }
      
      setTransactionPayload(data.transactionPayload);
      
      if (onTransactionCreated) {
        onTransactionCreated(data.transactionPayload);
      }
    } catch (err: any) {
      console.error('Error creating transaction:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleTransactionSigned = (signedTx: any) => {
    setSignedTransaction(signedTx);
  };
  
  const resetForm = () => {
    setTransactionPayload(null);
    setSignedTransaction(null);
    setError('');
  };
  
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-orange-400">Bitcoin Transaction with NEAR Chain Signatures</h2>
      
      <div className="mb-4 p-3 bg-gray-900 rounded-lg">
        <p className="text-gray-300">
          Your Bitcoin address: {isLoading ? 
            <span className="animate-pulse">Loading...</span> : 
            <span className="font-mono text-orange-300">{bitcoinAddress || 'Not available'}</span>
          }
        </p>
      </div>
      
      {!signedTransaction ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Action Type</label>
            <select
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
            >
              <option value="transfer">Bitcoin Transfer</option>
              <option value="etch_rune">Etch Rune</option>
              <option value="transfer_rune">Transfer Rune</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Derivation Path</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={derivationPath}
              onChange={(e) => setDerivationPath(e.target.value)}
              placeholder="bitcoin-1"
            />
            <p className="mt-1 text-xs text-gray-400">Path used to derive Bitcoin address from your NEAR account</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Receiver Address</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Bitcoin address"
            />
          </div>
          
          {(action === 'transfer' || action === 'transfer_rune') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount (BTC)</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0001"
              />
              <p className="mt-1 text-xs text-gray-400">Amount in BTC (e.g., 0.0001) or satoshis (e.g., 10000)</p>
            </div>
          )}
          
          {(action === 'etch_rune' || action === 'transfer_rune') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Rune Ticker</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={runeTicker}
                onChange={(e) => setRuneTicker(e.target.value)}
                placeholder="EXAMPLE"
              />
              <p className="mt-1 text-xs text-gray-400">The ticker symbol for your Rune (e.g., BITCOIN)</p>
            </div>
          )}
          
          {action === 'etch_rune' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Decimals</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={runeDecimals}
                  onChange={(e) => setRuneDecimals(e.target.value)}
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-gray-400">Number of decimal places for the Rune</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Mint Height</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={runeMintHeight}
                  onChange={(e) => setRuneMintHeight(e.target.value)}
                  placeholder="840000"
                />
                <p className="mt-1 text-xs text-gray-400">Block height at which the Rune will be minted</p>
              </div>
            </>
          )}
          
          {action === 'transfer_rune' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Rune Amount</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={runeAmount}
                onChange={(e) => setRuneAmount(e.target.value)}
                placeholder="1000"
              />
              <p className="mt-1 text-xs text-gray-400">Amount of Runes to transfer</p>
            </div>
          )}
          
          <button
            className="w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-600 disabled:text-gray-400 transition-colors font-medium mt-2"
            onClick={createTransaction}
            disabled={isLoading || !receiver}
          >
            {isLoading ? 
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span> : 
              'Create Transaction'
            }
          </button>
        </>
      ) : (
        <div className="mb-6">
          <div className="p-4 bg-green-900 text-green-200 rounded-lg border border-green-700 mb-4">
            <p className="font-semibold">Transaction signed and broadcast successfully!</p>
            <p className="mt-2 text-sm">Your transaction has been signed with your NEAR account and broadcast to the Bitcoin network.</p>
          </div>
          
          <button
            onClick={resetForm}
            className="w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Create New Transaction
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-900 text-red-200 rounded-lg border border-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {transactionPayload && !signedTransaction && (
        <>
          <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="font-bold mb-3 text-orange-400">Transaction Payload:</h3>
            <pre className="p-3 bg-black rounded-lg overflow-x-auto text-xs text-green-400 font-mono">
              {JSON.stringify(transactionPayload, null, 2)}
            </pre>
            <p className="mt-3 text-sm text-gray-300">
              Sign this transaction with your NEAR account to broadcast it to the Bitcoin network.
            </p>
          </div>
          
          {accountId && (
            <TransactionSigner 
              transactionPayload={transactionPayload} 
              nearAccountId={accountId}
              onTransactionSigned={handleTransactionSigned}
            />
          )}
        </>
      )}
    </div>
  );
} 