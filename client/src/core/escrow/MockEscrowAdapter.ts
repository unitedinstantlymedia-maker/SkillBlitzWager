import { Asset, MatchResult } from "@/core/types";
import { walletAdapter } from "@/core/wallet/WalletAdapter";
import { FEE_RATE, NETWORK_FEE_USD_PER_PLAYER, ASSET_PRICES_USD } from "@/config/economy";

export class MockEscrowAdapter {
  
  getEstimatedNetworkFee(asset: Asset): number {
    const price = ASSET_PRICES_USD[asset];
    if (!price) return 0;
    return NETWORK_FEE_USD_PER_PLAYER / price;
  }

  // Called when a match is successfully formed/active
  async lockFunds(matchId: string, asset: Asset, stake: number): Promise<boolean> {
    const networkFee = this.getEstimatedNetworkFee(asset);
    const totalRequired = stake + networkFee;
    
    try {
      // Attempt deduction via WalletAdapter
      walletAdapter.debit(asset, totalRequired);
      console.log(`[Escrow] Locked funds for match ${matchId}: ${stake} stake + ${networkFee} fee (${asset})`);
      return true;
    } catch (e) {
      console.error(`[Escrow] Failed to lock funds for match ${matchId}. Insufficient balance.`);
      return false;
    }
  }

  async settleMatch(matchId: string, asset: Asset, stake: number, result: MatchResult): Promise<{ payout: number, fee: number }> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate tx

    const pot = stake * 2;
    const fee = pot * FEE_RATE;
    let payout = 0;

    if (result === 'win') {
      payout = pot - fee;
      // Credit payout to wallet
      walletAdapter.credit(asset, payout);
    } else if (result === 'draw') {
        payout = stake; // Fallback
        // Refund stake (minus fees)
        walletAdapter.credit(asset, payout);
    }
    
    console.log(`[Escrow] Settled match ${matchId}: Result ${result}, Payout ${payout}, Fee ${fee}`);

    return { payout, fee };
  }
}

export const mockEscrowAdapter = new MockEscrowAdapter();
