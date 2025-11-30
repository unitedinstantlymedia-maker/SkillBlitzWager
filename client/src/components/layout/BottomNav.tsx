import { Link, useLocation } from "wouter";
import { Gamepad2, Wallet, History } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/games' && (location === '/' || location.startsWith('/games') || location.startsWith('/lobby'))) return true;
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl pb-safe">
      <div className="flex h-16 items-center justify-around px-4">
        <Link href="/games">
          <a className={cn(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            isActive('/games') ? "text-primary text-glow" : "text-muted-foreground hover:text-white"
          )}>
            <Gamepad2 className="h-6 w-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Play</span>
          </a>
        </Link>
        
        <Link href="/wallet">
          <a className={cn(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            isActive('/wallet') ? "text-primary text-glow" : "text-muted-foreground hover:text-white"
          )}>
            <Wallet className="h-6 w-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Wallet</span>
          </a>
        </Link>

        <Link href="/history">
          <a className={cn(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            isActive('/history') ? "text-primary text-glow" : "text-muted-foreground hover:text-white"
          )}>
            <History className="h-6 w-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">History</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
