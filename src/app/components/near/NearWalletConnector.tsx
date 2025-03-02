'use client';

import { useState, useEffect } from 'react';

interface NearWalletConnectorProps {
  onConnect: (accountId: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  accountId?: string;
}

export default function NearWalletConnector({ 
  onConnect, 
  onDisconnect, 
  isConnected, 
  accountId 
}: NearWalletConnectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use NEAR wallet selector or similar
      // For now, we'll simulate a connection with a prompt
      const userAccountId = window.prompt('Enter your NEAR account ID (e.g., example.near):');
      
      if (userAccountId) {
        onConnect(userAccountId);
        localStorage.setItem('nearAccountId', userAccountId);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    onDisconnect();
    localStorage.removeItem('nearAccountId');
  };

  // Check for existing connection on component mount
  useEffect(() => {
    const savedAccountId = localStorage.getItem('nearAccountId');
    if (savedAccountId && !isConnected) {
      onConnect(savedAccountId);
    }
  }, [isConnected, onConnect]);

  return (
    <div className="mb-6">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-600 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>Connect NEAR Wallet</>
          )}
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
            <span className="text-gray-300">Connected: </span>
            <span className="font-mono text-orange-300">{accountId}</span>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
} 