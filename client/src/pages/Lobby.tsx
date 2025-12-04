import { useGame } from "@/context/GameContext";
import { AssetType, STAKE_PRESETS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, Coins, Zap, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { escrowAdapter } from "@/core/escrow/EscrowAdapter";
import { SUPPORTED_ASSETS } from "@/config/escrow";

export default function Lobby() {
  const { state, dispatch, actions } = useGame();
  const [, setLocation] = useLocation();
  const [customStake, setCustomStake] = useState<string>("");
  const [isFinding, setIsFinding] = useState(false);

  const handleAssetChange = (value: string) => {
    if (value) dispatch({ type: 'SELECT_ASSET', payload: value as AssetType });
  };

  const handleStakeChange = (amount: number) => {
    dispatch({ type: 'SET_STAKE', payload: amount });
    setCustomStake("");
  };

  const handleCustomStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomStake(val);
    if (val && !isNaN(Number(val))) {
      dispatch({ type: 'SET_STAKE', payload: Number(val) });
    }
  };

  const handleFindMatch = async () => {
    if (!state.selectedGame) return;
    setIsFinding(true);
    await actions.startMatch();
    setIsFinding(false);
    setLocation('/match');
  };

  const networkFee = escrowAdapter.getEstimatedNetworkFee(state.selectedAsset);
  const totalCost = state.stakeAmount + networkFee;
  const isBalanceSufficient = state.wallet.balances[state.selectedAsset] >= totalCost;
  const isTon = state.selectedAsset === 'TON';

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
            {(['USDT', 'ETH', 'TON'] as AssetType[]).map((asset) => (
              <ToggleGroupItem 
                key={asset} 
                value={asset}
                disabled={SUPPORTED_ASSETS[asset].comingSoon}
                className="h-12 px-6 border border-white/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary/50 rounded-lg transition-all relative"
              >
                {asset}
                {SUPPORTED_ASSETS[asset].comingSoon && (
                  <span className="absolute -top-2 -right-2 text-[8px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full uppercase font-bold">Soon</span>
                )}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-xs font-mono text-muted-foreground ml-1">
            Balance: <span className="text-white">{state.wallet.balances[state.selectedAsset].toFixed(4)} {state.selectedAsset}</span>
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

        <Button 
          onClick={handleFindMatch}
          disabled={!isBalanceSufficient || state.stakeAmount <= 0 || isTon || isFinding}
          className="w-full h-14 text-lg font-display font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 border-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFinding ? "Initializing..." : isBalanceSufficient ? (
            <>
              <Zap className="mr-2 h-5 w-5" /> Find Match
            </>
          ) : (
            "Insufficient Balance"
          )}
        </Button>
      </div>
    </div>
  );
}
