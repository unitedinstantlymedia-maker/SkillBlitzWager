import { useGame } from "@/context/GameContext";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Trophy, XCircle } from "lucide-react";

export default function History() {
  const { state } = useGame();
  const { history } = state;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold uppercase tracking-wider">Match History</h1>

      {history.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No matches played yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="bg-card/50 border-white/10">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.result === 'win' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {item.result === 'win' ? <Trophy className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-display font-bold uppercase">{item.game}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {format(item.timestamp, 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-mono font-bold ${item.result === 'win' ? 'text-primary' : 'text-destructive'}`}>
                    {item.result === 'win' ? '+' : '-'}{item.result === 'win' ? (item.payout - item.stake).toFixed(4) : item.stake} {item.asset}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    Fee: {item.fee.toFixed(4)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
