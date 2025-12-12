import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import logoImage from '@assets/2025-12-12_07.52.28_1765519599465.jpg';

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center relative">
      <div className="fixed top-4 right-4 transform scale-150 origin-top-right z-50">
        <LanguageSelector />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex flex-col items-center justify-center gap-0">
          <h1 className="text-6xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 text-glow leading-none -mb-4 z-10">
            SKILLS
          </h1>
          <img src={logoImage} alt="2" className="w-32 h-32 object-contain relative z-0" />
          <h1 className="text-6xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 text-glow leading-none -mt-4 z-10">
            CRYPTO
          </h1>
        </div>
        <p className="text-2xl font-bold tracking-widest pt-6 text-transparent bg-clip-text bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#808080] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase">
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

        <div className="text-xs text-muted-foreground font-mono mt-2 text-center">
          USDT • ETH • TON
        </div>
      </motion.div>
    </div>
  );
}
