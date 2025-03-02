'use client';

import { useState } from 'react';

interface TransactionSignerProps {
  transactionPayload: any;
  nearAccountId: string;
  onTransactionSigned?: (signedTx: any) => void;
}

export default function TransactionSigner({ 
  transactionPayload, 
  nearAccountId, 
  onTransactionSigned 
}: TransactionSignerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [signedTransaction, setSignedTransaction] = useState<any>(null);
  const [txHash, setTxHash] = useState('');
  
  const signTransaction = async () => {
    setIsLoading(true);
    setError('');
    setSignedTransaction(null);
    setTxHash('');
    
    try {
      // In a real implementation, this would use NEAR wallet and Chain Signatures to sign
      // For this demo, we'll simulate the signing
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate signing the transaction
      const signedTx = {
        ...transactionPayload,
        signature: `simulated_near_signature_${Date.now()}`,
        status: 'signed',
        nearAccountId: nearAccountId
      };
      
      setSignedTransaction(signedTx);
      
      // In a real implementation, this would broadcast the tx to Bitcoin network
      // Simulate a successful transaction hash
      const simulatedTxHash = `${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`;
      setTxHash(simulatedTxHash);
      
      if (onTransactionSigned) {
        onTransactionSigned(signedTx);
      }
    } catch (err: any) {
      console.error('Error signing transaction:', err);
      setError(err.message || 'Failed to sign transaction');
    } finally {
      setIsLoading(false);
    }
  };
  
  // If no transaction payload is provided, don't render anything
  if (!transactionPayload) {
    return null;
  }
  
  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-orange-400">Sign Transaction</h3>
      
      <p className="text-gray-300 mb-4">
        Sign this Bitcoin transaction using your NEAR account <span className="font-mono text-orange-300">{nearAccountId}</span>
      </p>
      
      <button
        onClick={signTransaction}
        disabled={isLoading || !transactionPayload}
        className="w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-600 disabled:text-gray-400 transition-colors font-medium"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing with NEAR Wallet...
          </span>
        ) : (
          'Sign with NEAR Wallet'
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900 text-red-200 rounded-lg border border-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {signedTransaction && (
        <div className="mt-4">
          <div className="p-3 bg-green-900 text-green-200 rounded-lg border border-green-700 mb-4">
            <p className="font-medium">Transaction signed successfully!</p>
            {txHash && (
              <p className="mt-2">
                Transaction Hash: <span className="font-mono">{txHash}</span>
              </p>
            )}
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-orange-300 mb-2">Signed Transaction Details:</h4>
            <pre className="p-3 bg-black rounded-lg overflow-x-auto text-xs text-green-400 font-mono">
              {JSON.stringify(signedTransaction, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 