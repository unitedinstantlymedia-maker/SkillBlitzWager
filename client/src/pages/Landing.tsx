import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center relative">
      <div className="absolute top-0 right-0">
        <LanguageSelector />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-6xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 text-glow">
          SKILL<br/>BLITZ
        </h1>
        <p className="text-muted-foreground text-lg font-light tracking-wide">
          {t('1v1 Crypto Wagers', '1v1 Crypto Wagers')}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <Link href="/games">
          <Button className="w-full h-14 text-lg font-display font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 border-glow">
            {t('Play Now', 'Play Now')}
          </Button>
        </Link>
        
        <Link href="/rules">
          <Button variant="outline" className="w-full h-14 text-lg font-display font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 hover:text-white">
            {t('Rules & Risks', 'Rules & Risks')}
          </Button>
        </Link>
      </motion.div>

      <div className="absolute bottom-24 text-xs text-muted-foreground font-mono">
        USDT • ETH • TON
      </div>
    </div>
  );
}
