'use client';

import { useState, useEffect } from 'react';
import { deriveAddressFromNearAccount } from '@/app/services/bitcoinChainSignatures';
import { ACCOUNT_ID } from '@/app/config';

interface BitcoinTransactionProps {
  onTransactionCreated?: (transactionPayload: any) => void;
}

export default function BitcoinTransaction({ onTransactionCreated }: BitcoinTransactionProps) {
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
  
  // Derive Bitcoin address from NEAR account on component mount
  useEffect(() => {
    async function fetchAddress() {
      if (!ACCOUNT_ID) return;
      
      try {
        setIsLoading(true);
        const { address, publicKey } = await deriveAddressFromNearAccount(ACCOUNT_ID, derivationPath);
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
  }, [derivationPath]);
  
  // Update address when derivation path changes
  useEffect(() => {
    async function updateAddress() {
      if (!ACCOUNT_ID) return;
      
      try {
        const { address, publicKey } = await deriveAddressFromNearAccount(ACCOUNT_ID, derivationPath);
        setBitcoinAddress(address);
        setBitcoinPublicKey(publicKey);
      } catch (err) {
        console.error('Error updating Bitcoin address:', err);
      }
    }
    
    updateAddress();
  }, [derivationPath]);
  
  async function createTransaction() {
    setIsLoading(true);
    setError('');
    setTransactionPayload(null);
    
    try {
      // Build URL with query parameters based on the selected action
      let url = `/api/tools/bitcoin-transaction?action=${action}&receiver=${receiver}&derivationPath=${derivationPath}`;
      
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
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Bitcoin Transaction with NEAR Chain Signatures</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">Your Bitcoin address: {isLoading ? 'Loading...' : bitcoinAddress || 'Not available'}</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={action}
          onChange={(e) => setAction(e.target.value as any)}
        >
          <option value="transfer">Bitcoin Transfer</option>
          <option value="etch_rune">Etch Rune</option>
          <option value="transfer_rune">Transfer Rune</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Derivation Path</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={derivationPath}
          onChange={(e) => setDerivationPath(e.target.value)}
          placeholder="bitcoin-1"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Address</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Bitcoin address"
        />
      </div>
      
      {(action === 'transfer' || action === 'transfer_rune') && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (BTC)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0001"
          />
        </div>
      )}
      
      {(action === 'etch_rune' || action === 'transfer_rune') && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rune Ticker</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={runeTicker}
            onChange={(e) => setRuneTicker(e.target.value)}
            placeholder="EXAMPLE"
          />
        </div>
      )}
      
      {action === 'etch_rune' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Decimals</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={runeDecimals}
              onChange={(e) => setRuneDecimals(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mint Height</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={runeMintHeight}
              onChange={(e) => setRuneMintHeight(e.target.value)}
              placeholder="840000"
            />
          </div>
        </>
      )}
      
      {action === 'transfer_rune' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rune Amount</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={runeAmount}
            onChange={(e) => setRuneAmount(e.target.value)}
            placeholder="1000"
          />
        </div>
      )}
      
      <button
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        onClick={createTransaction}
        disabled={isLoading || !receiver}
      >
        {isLoading ? 'Processing...' : 'Create Transaction'}
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {transactionPayload && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Transaction Payload:</h3>
          <pre className="p-2 bg-gray-100 rounded overflow-x-auto text-xs">
            {JSON.stringify(transactionPayload, null, 2)}
          </pre>
          <p className="mt-2 text-sm text-gray-600">
            Use this payload with the NEAR Chain Signatures service to sign and broadcast the transaction.
          </p>
        </div>
      )}
    </div>
  );
} 