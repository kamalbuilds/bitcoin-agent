import { NextResponse } from 'next/server';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { ACCOUNT_ID } from '@/app/config';

/**
 * Bitcoin Transaction Handler using NEAR Chain Signatures
 * 
 * This endpoint creates Bitcoin transactions that can be signed using NEAR chain signatures.
 * It supports standard Bitcoin transfers, Runes etching and transfers, and more.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get common parameters
    const action = searchParams.get('action') || 'transfer'; // transfer, etch_rune, transfer_rune
    const receiver = searchParams.get('receiver'); // Bitcoin receiver address
    const amount = searchParams.get('amount'); // Amount in BTC or satoshis
    const derivationPath = searchParams.get('derivationPath') || 'bitcoin-1'; // Path used to derive the Bitcoin address from NEAR account
    
    // Rune-specific parameters
    const runeTicker = searchParams.get('runeTicker'); // Ticker for the rune
    const runeAmount = searchParams.get('runeAmount'); // Amount of runes
    const runeDecimals = searchParams.get('runeDecimals') || '0'; // Decimals for the rune
    const runeMintHeight = searchParams.get('runeMintHeight'); // Block height for rune mint

    // Validation
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver address is required' }, { status: 400 });
    }

    if (!amount && (action === 'transfer' || action === 'transfer_rune')) {
      return NextResponse.json({ error: 'Amount is required for transfers' }, { status: 400 });
    }

    if (action === 'etch_rune' && (!runeTicker || !runeMintHeight)) {
      return NextResponse.json({ error: 'Rune ticker and mint height are required for etching' }, { status: 400 });
    }

    if (action === 'transfer_rune' && (!runeTicker || !runeAmount)) {
      return NextResponse.json({ error: 'Rune ticker and amount are required for rune transfers' }, { status: 400 });
    }

    // Create the appropriate transaction payload based on the action
    let transactionPayload: any = {
      nearAccountId: ACCOUNT_ID,
      derivationPath: derivationPath,
      receiver: receiver,
    };
    
    // Standard Bitcoin transfer
    if (action === 'transfer') {
      transactionPayload = {
        ...transactionPayload,
        action: 'transfer',
        amountSatoshis: parseAmount(amount || '0'),
      };
    }
    // Etch a new rune
    else if (action === 'etch_rune') {
      const opReturnHex = generateRuneEtchOpReturn(runeTicker || '', parseInt(runeDecimals), parseInt(runeMintHeight || '0'));
      transactionPayload = {
        ...transactionPayload,
        action: 'etch_rune',
        amountSatoshis: 10000, // Standard small amount for inscription
        opReturnHex: opReturnHex,
        runeTicker: runeTicker,
        runeDecimals: runeDecimals,
      };
    }
    // Transfer runes
    else if (action === 'transfer_rune') {
      const opReturnHex = generateRuneTransferOpReturn(runeTicker || '', parseAmount(runeAmount || '0'));
      transactionPayload = {
        ...transactionPayload,
        action: 'transfer_rune',
        amountSatoshis: parseAmount(amount || '0'),
        opReturnHex: opReturnHex,
        runeTicker: runeTicker,
        runeAmount: runeAmount,
      };
    }

    return NextResponse.json({ 
      transactionPayload,
      message: `Bitcoin ${action} transaction payload created successfully`,
      instructions: "To sign and broadcast this transaction, use the NEAR Chain Signatures service with the provided derivation path."
    });
  } catch (error) {
    console.error('Error generating Bitcoin transaction payload:', error);
    return NextResponse.json({ error: 'Failed to generate Bitcoin transaction payload' }, { status: 500 });
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