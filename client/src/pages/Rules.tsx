import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Wallet, Shield, Swords } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Rules() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold uppercase tracking-wider">Rules & Risks</h1>
      </div>

      <div className="space-y-4">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <Swords className="h-5 w-5" />
              <CardTitle className="font-display uppercase tracking-wide text-lg">Fair Play</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Matches are 1v1 skill-based. No chance involved. The winner takes the pot minus fees.
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-accent">
              <Wallet className="h-5 w-5" />
              <CardTitle className="font-display uppercase tracking-wide text-lg">Crypto Only</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            We support USDT, ETH, and TON. Ensure you have sufficient balance before playing. Wagers are locked in escrow during the match.
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-yellow-500">
              <Shield className="h-5 w-5" />
              <CardTitle className="font-display uppercase tracking-wide text-lg">Platform Fee</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            A flat 3% fee is deducted from the total pot of every match to support platform development and maintenance.
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="font-display uppercase tracking-wide text-lg">Prototype Disclaimer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-destructive-foreground/80 leading-relaxed">
            This is a prototype. Games are simulated for demonstration. Do not use real funds yet.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
