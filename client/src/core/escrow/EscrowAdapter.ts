import { GameType, AssetType } from "@/lib/types";
import { FEE_ADDRESS, NETWORK_FEE_USD_PER_PLAYER, SUPPORTED_ASSETS } from "@/config/escrow";

export interface MatchParams {
  game: GameType;
  asset: AssetType;
  stake: number;
  playerAddress: string;
}

export interface MatchResult {
  matchId: string;
  winnerAddress: string;
}

export interface SettleResult {
  payoutTxRef: string;
  feeTxRef: string;
  payoutAmount: number;
  feeAmount: number;
  netProfit: number; // Payout - Stake
}

export interface IEscrowAdapter {
  createOrJoinMatch(params: MatchParams): Promise<{ matchId: string; txRef: string; networkFee: number }>;
  settleMatch(result: MatchResult, stake: number, asset: AssetType): Promise<SettleResult>;
  getMatch(matchId: string): Promise<any>; // Placeholder for reading on-chain match data
  getEstimatedNetworkFee(asset: AssetType): number;
}

export class MockEscrowAdapter implements IEscrowAdapter {
  
  getEstimatedNetworkFee(asset: AssetType): number {
    const assetInfo = SUPPORTED_ASSETS[asset];
    if (!assetInfo || assetInfo.comingSoon) return 0;
    // Calculate fee in crypto terms: 0.25 USD / Price
    return NETWORK_FEE_USD_PER_PLAYER / assetInfo.usdPrice;
  }

  async createOrJoinMatch(params: MatchParams): Promise<{ matchId: string; txRef: string; networkFee: number }> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate tx
    
    const networkFee = this.getEstimatedNetworkFee(params.asset);
    
    return {
      matchId: Math.random().toString(36).substring(7),
      txRef: `0x${Math.random().toString(36).substring(2)}`,
      networkFee
    };
  }

  async settleMatch(result: MatchResult, stake: number, asset: AssetType): Promise<SettleResult> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate tx

    const pot = stake * 2;
    const feeAmount = pot * 0.03; // 3%
    const payoutAmount = pot - feeAmount;

    return {
      payoutTxRef: `0x${Math.random().toString(36).substring(2)}`,
      feeTxRef: `0x${Math.random().toString(36).substring(2)}`,
      payoutAmount,
      feeAmount,
      netProfit: payoutAmount - stake
    };
  }

  async getMatch(matchId: string): Promise<any> {
    return { id: matchId, status: 'mocked' };
  }
}

export class EvmEscrowAdapter implements IEscrowAdapter {
  private contractAddress: string;
  private chainId: number;

  constructor(contractAddress: string, chainId: number) {
    this.contractAddress = contractAddress;
    this.chainId = chainId;
  }

  getEstimatedNetworkFee(asset: AssetType): number {
     throw new Error("Method not implemented.");
  }

  async createOrJoinMatch(params: MatchParams): Promise<{ matchId: string; txRef: string; networkFee: number }> {
    throw new Error("Method not implemented.");
  }

  async settleMatch(result: MatchResult, stake: number, asset: AssetType): Promise<SettleResult> {
    throw new Error("Method not implemented.");
  }

  async getMatch(matchId: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

// Export the mock for now
export const escrowAdapter = new MockEscrowAdapter();
