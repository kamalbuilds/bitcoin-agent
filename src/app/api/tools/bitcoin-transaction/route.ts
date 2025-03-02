import { NextRequest, NextResponse } from 'next/server';
import { 
  createBitcoinTransferTransaction, 
  createEtchRuneTransaction,
  createTransferRuneTransaction,
  deriveAddressFromNearAccount
} from '@/app/services/bitcoinChainSignatures';
import { ACCOUNT_ID } from '@/app/config';

/**
 * Bitcoin Transaction Handler using NEAR Chain Signatures
 * 
 * This endpoint creates Bitcoin transactions that can be signed using NEAR chain signatures.
 * It supports standard Bitcoin transfers, Runes etching and transfers, and more.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const receiver = searchParams.get('receiver');
    const derivationPath = searchParams.get('derivationPath') || 'bitcoin-1';
    const amount = searchParams.get('amount');
    const runeTicker = searchParams.get('runeTicker');
    const runeAmount = searchParams.get('runeAmount');
    const runeDecimals = searchParams.get('runeDecimals');
    const runeMintHeight = searchParams.get('runeMintHeight');
    
    // Get the accountId from the request or fall back to the default
    const accountId = searchParams.get('accountId') || ACCOUNT_ID;
    
    if (!accountId) {
      return NextResponse.json(
        { error: 'NEAR account ID is required' },
        { status: 400 }
      );
    }
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }
    
    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver address is required' },
        { status: 400 }
      );
    }
    
    // Derive the Bitcoin address from the NEAR account
    const { address: senderAddress, publicKey } = await deriveAddressFromNearAccount(accountId, derivationPath);
    
    let transactionPayload;
    
    switch (action) {
      case 'transfer':
        if (!amount) {
          return NextResponse.json(
            { error: 'Amount is required for transfer' },
            { status: 400 }
          );
        }
        
        transactionPayload = await createBitcoinTransferTransaction({
          senderAddress,
          receiverAddress: receiver,
          amount: parseFloat(amount),
          publicKey
        });
        break;
        
      case 'etch_rune':
        if (!runeTicker) {
          return NextResponse.json(
            { error: 'Rune ticker is required for etch_rune' },
            { status: 400 }
          );
        }
        
        transactionPayload = await createEtchRuneTransaction({
          senderAddress,
          receiverAddress: receiver,
          runeTicker,
          decimals: runeDecimals ? parseInt(runeDecimals) : 0,
          mintHeight: runeMintHeight ? parseInt(runeMintHeight) : 840000,
          publicKey
        });
        break;
        
      case 'transfer_rune':
        if (!amount || !runeTicker || !runeAmount) {
          return NextResponse.json(
            { error: 'Amount, rune ticker, and rune amount are required for transfer_rune' },
            { status: 400 }
          );
        }
        
        transactionPayload = await createTransferRuneTransaction({
          senderAddress,
          receiverAddress: receiver,
          amount: parseFloat(amount),
          runeTicker,
          runeAmount: parseInt(runeAmount),
          publicKey
        });
        break;
        
      default:
        return NextResponse.json(
          { error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ transactionPayload });
  } catch (error: any) {
    console.error('Error creating Bitcoin transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

/**
 * Parse amount string to satoshis (integer)
 */
function parseAmount(amount: string): number {
  // Check if amount is in BTC format (contains a decimal point)
  if (amount.includes('.')) {
    // Convert BTC to satoshis (1 BTC = 100,000,000 satoshis)
    return Math.floor(parseFloat(amount) * 100000000);
  }
  // Otherwise assume it's already in satoshis
  return parseInt(amount);
}

/**
 * Generate OP_RETURN data for Rune etching
 * Format follows the Runes protocol specification
 */
function generateRuneEtchOpReturn(ticker: string, decimals: number, mintHeight: number): string {
  // Simple implementation - in a real application, this would follow the exact Runes protocol specification
  // The format here is a simplified version just for demonstration
  const runePrefix = "52"; // 'R' in hex
  const tickerHex = Buffer.from(ticker).toString('hex');
  const decimalsHex = decimals.toString(16).padStart(2, '0');
  const heightHex = mintHeight.toString(16).padStart(8, '0');
  
  return runePrefix + tickerHex + decimalsHex + heightHex;
}

/**
 * Generate OP_RETURN data for Rune transfer
 * Format follows the Runes protocol specification
 */
function generateRuneTransferOpReturn(ticker: string, amount: number): string {
  // Simple implementation - in a real application, this would follow the exact Runes protocol specification
  const runePrefix = "52"; // 'R' in hex
  const transferPrefix = "54"; // 'T' in hex
  const tickerHex = Buffer.from(ticker).toString('hex');
  const amountHex = amount.toString(16).padStart(16, '0');
  
  return runePrefix + transferPrefix + tickerHex + amountHex;
} 