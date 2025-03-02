import BitcoinTransaction from '../components/bitcoin/BitcoinTransaction';

export default function BitcoinPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bitcoin Transactions with NEAR Chain Signatures</h1>
      
      <div className="mb-6">
        <p className="text-gray-700">
          This page allows you to create Bitcoin transactions that can be signed using NEAR Chain Signatures.
          You can perform standard Bitcoin transfers, etch new Runes, or transfer existing Runes.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <BitcoinTransaction />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">How It Works</h2>
        <p className="mb-2">
          NEAR Chain Signatures enable NEAR accounts to sign and execute transactions on the Bitcoin blockchain.
          This allows you to control Bitcoin assets directly from your NEAR account without needing a separate Bitcoin wallet.
        </p>
        <p className="mb-2">
          The process works by:
        </p>
        <ol className="list-decimal list-inside ml-4 mb-4">
          <li className="mb-1">Deriving a Bitcoin address from your NEAR account using a derivation path</li>
          <li className="mb-1">Creating a Bitcoin transaction payload</li>
          <li className="mb-1">Signing the transaction using NEAR's Multi-Party Computation service</li>
          <li className="mb-1">Broadcasting the signed transaction to the Bitcoin network</li>
        </ol>
        <p>
          For more information, see the <a href="https://docs.near.org/chain-abstraction/chain-signatures" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">NEAR Chain Signatures documentation</a>.
        </p>
      </div>
    </div>
  );
} 