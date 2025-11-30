import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function Wallet() {
  const { state } = useGame();
  const { wallet } = state;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold uppercase tracking-wider">Wallet</h1>

      <Card className="bg-gradient-to-br from-primary/20 to-card border-primary/30">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Connected Address</CardTitle>
              <div className="flex items-center gap-2 font-mono text-lg">
                {wallet.connected ? wallet.address : 'Not Connected'}
                {wallet.connected && <Copy className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-white" />}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <WalletIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Assets</h2>
        
        {(['USDT', 'ETH', 'TON'] as const).map((asset) => (
          <Card key={asset} className="bg-card/50 border-white/10">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  asset === 'USDT' ? 'bg-green-500/20 text-green-500' :
                  asset === 'ETH' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-blue-400/20 text-blue-400'
                }`}>
                  {asset[0]}
                </div>
                <span className="font-display font-bold">{asset}</span>
              </div>
              <div className="font-mono font-bold text-lg">
                {wallet.balances[asset].toFixed(4)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button className="h-12 bg-white/5 hover:bg-white/10 border-white/10">
          <ArrowDownLeft className="mr-2 h-4 w-4" /> Deposit
        </Button>
        <Button className="h-12 bg-white/5 hover:bg-white/10 border-white/10">
          <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
        </Button>
      </div>
    </div>
  );
}
