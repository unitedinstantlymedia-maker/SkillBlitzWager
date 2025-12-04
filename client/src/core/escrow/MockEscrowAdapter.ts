import { Asset, MatchResult } from "@/core/types";
import { walletStore } from "@/core/wallet/WalletStore";
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
    
    // Attempt deduction via WalletStore
    const success = walletStore.deduct(asset, totalRequired);
    
    if (success) {
      console.log(`[Escrow] Locked funds for match ${matchId}: ${stake} stake + ${networkFee} fee (${asset})`);
    } else {
      console.error(`[Escrow] Failed to lock funds for match ${matchId}. Insufficient balance.`);
    }
    
    return success;
  }

  async settleMatch(matchId: string, asset: Asset, stake: number, result: MatchResult): Promise<{ payout: number, fee: number }> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate tx

    const pot = stake * 2;
    const fee = pot * FEE_RATE;
    let payout = 0;

    if (result === 'win') {
      payout = pot - fee;
      // Credit payout to wallet
      walletStore.credit(asset, payout);
    } else if (result === 'draw') {
        // Refund stake? Or pot/2 - fee? Usually draw = refund stake minus fee?
        // Prompt says "winner receives pot - fee". Doesn't specify draw.
        // Let's assume draw = refund stake (minus network fee which is already gone).
        // But platform fee? Usually platform takes fee on draw too or refunds all.
        // Let's assume simple win/loss for now as per prompt "winner/loser result".
        payout = stake; // Fallback
    }
    
    console.log(`[Escrow] Settled match ${matchId}: Result ${result}, Payout ${payout}, Fee ${fee}`);

    return { payout, fee };
  }
}

export const mockEscrowAdapter = new MockEscrowAdapter();
