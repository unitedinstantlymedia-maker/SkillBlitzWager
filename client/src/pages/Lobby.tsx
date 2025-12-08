import { useGame } from "@/context/GameContext";
import { STAKE_PRESETS } from "@/config/economy";
import { Asset } from "@/core/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, Coins, Zap, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { mockEscrowAdapter } from "@/core/escrow/MockEscrowAdapter";

export default function Lobby() {
  const { state, actions } = useGame();
  const [, setLocation] = useLocation();
  const [customStake, setCustomStake] = useState<string>("");

  const handleAssetChange = (value: string) => {
    if (value) actions.selectAsset(value as Asset);
  };

  const handleStakeChange = (amount: number) => {
    actions.setStake(amount);
    setCustomStake("");
  };

  const handleCustomStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomStake(val);
    if (val && !isNaN(Number(val))) {
      actions.setStake(Number(val));
    }
  };

  const handleStartSearch = async () => {
    console.log("[Lobby] Start Search clicked");
    // Set searching UI immediately
    // Note: actions.startSearch will toggle isFinding in context, but we can log here
    await actions.startSearch();
  };

  const handleCancelSearch = () => {
    console.log("[Lobby] Cancel Search clicked");
    actions.cancelSearch();
  };

  // Navigate to play if match active
  if (state.currentMatch && state.currentMatch.status === 'active') {
    console.log("[Lobby] Match active, redirecting to Play");
    setLocation(`/play/${state.selectedGame?.toLowerCase()}`);
    return null; 
  }

  const networkFee = mockEscrowAdapter.getEstimatedNetworkFee(state.selectedAsset);
  const totalCost = state.stakeAmount + networkFee;
  
  const currentBalance = state.wallet.balances[state.selectedAsset] || 0;
  // Relaxed condition: allow search even if balance low for prototype, but warn? 
  // User asked to relax disabled conditions.
  // We will just check stake > 0.
  const canSearch = state.stakeAmount > 0; 
  const isBalanceSufficient = currentBalance >= totalCost;
  const isTon = state.selectedAsset === 'TON'; // TON is coming soon

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/games">
          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold uppercase tracking-wider">Lobby</h1>
          <p className="text-muted-foreground text-sm">{state.selectedGame}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Asset Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Asset</label>
          <ToggleGroup type="single" value={state.selectedAsset} onValueChange={handleAssetChange} className="justify-start gap-3">
            {(['USDT', 'ETH', 'TON'] as Asset[]).map((asset) => (
              <ToggleGroupItem 
                key={asset} 
                value={asset}
                disabled={asset === 'TON'}
                className="h-12 px-6 border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary/50 rounded-lg transition-all relative"
              >
                {asset}
                {asset === 'TON' && (
                  <span className="absolute -top-2 -right-2 text-[8px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full uppercase font-bold">Soon</span>
                )}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-xs font-mono text-muted-foreground ml-1">
            Balance: <span className={isBalanceSufficient ? "text-white" : "text-destructive font-bold"}>
              {currentBalance.toFixed(4)} {state.selectedAsset}
            </span>
          </p>
        </div>

        {/* Stake Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Wager Amount</label>
          <div className="grid grid-cols-4 gap-2">
            {STAKE_PRESETS.map((amount) => (
              <Button
                key={amount}
                disabled={isTon}
                variant={state.stakeAmount === amount && !customStake ? "default" : "outline"}
                onClick={() => handleStakeChange(amount)}
                className={cn(
                  "h-12 font-mono font-bold border-white/10",
                  state.stakeAmount === amount && !customStake ? "bg-accent text-accent-foreground border-accent/50" : "hover:bg-white/5 hover:text-white"
                )}
              >
                {amount}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="Custom Amount"
              value={customStake}
              onChange={handleCustomStakeChange}
              disabled={isTon}
              className="h-12 bg-black/20 border-white/10 font-mono pl-10"
            />
            <Coins className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-card/50 border-white/10 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pot Size (2x)</span>
            <span className="font-mono font-bold">{state.stakeAmount * 2} {state.selectedAsset}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fee (3%) deducted</span>
            <span className="font-mono text-muted-foreground">
              {(state.stakeAmount * 2 * 0.03).toFixed(4)} {state.selectedAsset}
            </span>
          </div>
          
          {/* Network Fee Estimate */}
          <div className="flex justify-between text-sm pt-2 border-t border-white/5">
             <div className="flex items-center gap-1 text-muted-foreground">
               <span>Est. Network Fee</span>
               <Info className="h-3 w-3" />
             </div>
             <span className="font-mono text-xs text-muted-foreground">
               {networkFee > 0 ? `~${networkFee.toFixed(5)} ${state.selectedAsset}` : '0.00'}
             </span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 text-right">Paid by you (deducted from balance)</p>

          <div className="border-t border-white/10 my-2 pt-2 flex justify-between text-lg font-display font-bold">
            <span className="text-primary">Potential Win</span>
            <span className="text-primary text-glow">
              {(state.stakeAmount * 2 * 0.97).toFixed(4)} {state.selectedAsset}
            </span>
          </div>
        </Card>

        {state.isFinding ? (
          <Button 
            onClick={handleCancelSearch}
            variant="destructive"
            className="w-full h-14 text-lg font-display font-bold uppercase tracking-widest border-glow animate-pulse"
          >
            <X className="mr-2 h-5 w-5" /> Cancel Search
          </Button>
        ) : (
          <Button 
            onClick={handleStartSearch}
            disabled={!canSearch || isTon} // Relaxed: removed !isBalanceSufficient check for button enable
            className="w-full h-14 text-lg font-display font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 border-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isBalanceSufficient && canSearch ? (
               <>
                 <Zap className="mr-2 h-5 w-5" /> Find Match (Low Bal)
               </>
            ) : (
               <>
                 <Zap className="mr-2 h-5 w-5" /> Find Match
               </>
            )}
          </Button>
        )}
        
        {state.isFinding && (
           <div className="text-center text-xs text-muted-foreground animate-pulse">
             Searching for opponent... ({state.selectedAsset} {state.stakeAmount})
           </div>
        )}
      </div>
    </div>
  );
}
