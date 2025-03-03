# Bitcoin Agent with NEAR Chain Signatures

This project demonstrates how to create and sign Bitcoin transactions using NEAR Chain Signatures. It enables users to control Bitcoin assets directly from their NEAR account without needing a separate Bitcoin wallet.

## Features

- **NEAR Wallet Integration**: Connect your NEAR wallet to derive Bitcoin addresses
- **Bitcoin Address Derivation**: Automatically derive Bitcoin addresses from NEAR accounts
- **Transaction Creation**: Create various types of Bitcoin transactions:
  - Standard Bitcoin transfers
  - Rune etching (creating new Runes)
  - Rune transfers
- **Transaction Signing**: Sign Bitcoin transactions using NEAR Chain Signatures
- **Responsive UI**: Modern, user-friendly interface with dark theme
- **AI Agent Integration**: Seamless integration with Bitte AI for conversational Bitcoin operations

## Prerequisites

- Node.js 18+ and npm
- NEAR account (for wallet connection and signing)
- Bitte AI API key (for AI agent integration)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd agent-next-boilerplate
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   # Create a .env.local file with the following variables
   BITTE_API_KEY='your-api-key'
   ACCOUNT_ID='your-account.near'
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Connecting Your NEAR Wallet

1. Navigate to the Bitcoin page at `/bitcoin`
2. Click the "Connect NEAR Wallet" button
3. Enter your NEAR account ID when prompted
4. Your Bitcoin address will be derived automatically

### Creating a Bitcoin Transaction

1. Ensure your NEAR wallet is connected
2. Select the transaction type:
   - Bitcoin Transfer: Send BTC to another address
   - Etch Rune: Create a new Rune
   - Transfer Rune: Send existing Runes
3. Fill in the required details:
   - Receiver address
   - Amount (for transfers)
   - Rune details (for Rune operations)
4. Click "Create Transaction"

### Signing and Broadcasting

1. Review the transaction payload
2. Click "Sign with NEAR Wallet"
3. The transaction will be signed with your NEAR account and broadcast to the Bitcoin network
4. A transaction hash will be generated upon success

## Architecture

### Key Components

- **NearWalletConnector**: Manages NEAR wallet connection and account state
- **BitcoinTransaction**: Handles transaction creation and UI for transaction forms
- **TransactionSigner**: Manages the signing process with NEAR Chain Signatures
- **bitcoinChainSignatures**: Service for deriving addresses and creating transaction payloads
- **API Endpoints**: RESTful endpoints for transaction creation and signing

### Bitcoin Transaction Flow

1. NEAR account connects and is authenticated
2. Bitcoin address is derived from the NEAR account using a derivation path
3. Transaction parameters are collected from the user interface
4. Transaction payload is created via the API
5. Payload is signed using NEAR Chain Signatures
6. Signed transaction is broadcast to the Bitcoin network

## AI Agent Integration

This project includes integration with Bitte AI, allowing users to interact with Bitcoin transactions through conversational AI.

### AI Agent Features

- Conversational interface for Bitcoin transactions
- Natural language processing for transaction creation
- Contextual help and guidance for users
- Integration with NEAR Chain Signatures
- Support for standard transfers and Runes operations

### Using the AI Agent

1. Deploy your application to a publicly accessible URL
2. Set up the AI agent in Bitte AI:
   ```
   npm run deploy:bitte
   ```
3. Access your agent through Bitte AI at https://bitcoin-agent.bitte.ai
4. Start a conversation with commands like:
   - "Create a Bitcoin transaction to address bc1q..."
   - "Etch a new Rune with ticker EXAMPLE"
   - "Transfer 100 BITCOIN runes to address bc1q..."

### AI Agent Configuration

The agent's capabilities are defined in the AI plugin manifest at `/.well-known/ai-plugin.json`. The configuration includes:

- Tool descriptions for Bitcoin transaction operations
- API endpoint specifications
- Natural language processing hints
- Example prompts and use cases

## API Reference

### `GET /api/tools/bitcoin-transaction`

Creates a Bitcoin transaction payload based on the provided parameters.

Query Parameters:
- `action`: The transaction type (`transfer`, `etch_rune`, or `transfer_rune`)
- `receiver`: The Bitcoin receiver address
- `derivationPath`: The derivation path used for the Bitcoin address
- `accountId`: The NEAR account ID
- `amount`: The amount in BTC (for transfers)
- `runeTicker`: The ticker symbol for the Rune
- `runeAmount`: The amount of Runes to transfer
- `runeDecimals`: The number of decimal places for the Rune
- `runeMintHeight`: The block height at which the Rune will be minted

## Deployment

### Deploying to bitte.ai

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to bitte.ai:
   ```
   npm run deploy:bitte
   ```

3. Troubleshooting deployment:
   - If you encounter errors like "Plugin spec not found", ensure your server is correctly serving the AI plugin manifest at `/.well-known/ai-plugin.json`
   - Verify that your application is accessible at the specified URL
   - Check that your BITTE_API_KEY is valid and properly configured

## Security Considerations

- Private keys are never exposed in the browser
- NEAR Chain Signatures provide secure cross-chain operations
- All transaction signing happens within the NEAR protocol's secure environment

## Resources

- [NEAR Chain Signatures Documentation](https://docs.near.org/chain-abstraction/chain-signatures)
- [Bitcoin Protocol Documentation](https://developer.bitcoin.org/)
- [Runes Protocol Documentation](https://docs.runes.org/)
- [Bitte AI Documentation](https://docs.bitte.ai)

## License

This project is licensed under the MIT License.
