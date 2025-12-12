import { Link, useLocation } from "wouter";
import { Gamepad2, Wallet, History, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ShareDialog } from "@/components/share/ShareDialog";
import { useLanguage } from "@/context/LanguageContext";

export function BottomNav() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === '/' && (location === '/' || location.startsWith('/games') || location.startsWith('/lobby') || location.startsWith('/play') || location.startsWith('/result'))) return true;
    return location === path;
  };

  const handleShare = async () => {
    // Try native share first
    const shareData = {
      title: 'SkillBlitz',
      text: 'Play 1v1 crypto skill games with me on SkillBlitz! 🎮💸',
      url: window.location.origin
    };

    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // If user cancelled or failed, just fallback to dialog? 
        // Or ignore cancellation.
        console.log('Native share cancelled or failed', err);
      }
    } else {
      // On desktop or if native share not preferred, open custom dialog
      setShareOpen(true);
    }
  };

  const navItems = [
    { 
      path: '/', 
      label: t('Home', 'Home'), 
      icon: Gamepad2,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      glowColor: 'shadow-blue-500/50',
      iconColor: 'text-blue-400'
    },
    { 
      path: '/wallet', 
      label: t('Wallet', 'Wallet'), 
      icon: Wallet,
      color: 'from-primary/20 to-green-500/20', // Matches Play Now primary/green style but semi-transparent
      borderColor: 'border-primary/50',
      glowColor: 'shadow-primary/50',
      iconColor: 'text-primary'
    },
    { 
      path: '/history', 
      label: t('History', 'History'), 
      icon: History,
      color: 'from-purple-500/20 to-pink-500/20', // Same semi-transparent style
      borderColor: 'border-purple-500/50',
      glowColor: 'shadow-purple-500/50',
      iconColor: 'text-purple-400'
    },
    { 
      path: '#share', 
      label: t('Share', 'Share'), 
      icon: Share2,
      color: 'from-blue-600/20 to-indigo-600/20', // Same semi-transparent style
      borderColor: 'border-blue-400/50',
      glowColor: 'shadow-blue-500/60',
      iconColor: 'text-blue-200',
      isAction: true
    }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
      <nav className="pointer-events-auto flex items-center gap-4 p-2 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl relative">
        {navItems.map((item) => {
          const isShare = item.path === '#share';
          const active = isActive(item.path);
          
          const Content = () => (
            <motion.div
              className={cn(
                "relative w-24 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300",
                "border backdrop-blur-md shadow-lg cursor-pointer overflow-hidden",
                "bg-gradient-to-br", item.color, // Always apply color
                active 
                  ? cn("border-2", item.borderColor, item.glowColor, "shadow-[0_0_20px_rgba(0,0,0,0.5)]") 
                  : "border-white/10 opacity-90 hover:opacity-100" // Slight opacity diff instead of gray
              )}
              animate={{ 
                y: active ? -8 : 0,
                scale: active ? 1.05 : 1,
              }}
              whileHover={{ 
                y: active ? -10 : -4,
                scale: 1.05 
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Glossy sheen */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

              {/* Icon */}
              <item.icon className={cn(
                "h-6 w-6 z-10 drop-shadow-md transition-colors duration-300",
                "text-white" // Always white/bright
              )} />
              
              {/* Label */}
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest z-10 transition-colors duration-300",
                "text-white" // Always white/bright
              )}>
                {item.label}
              </span>

              {/* Active Glow Background Effect */}
              {active && (
                <motion.div
                  layoutId="active-glow"
                  className={cn("absolute inset-0 opacity-30 bg-gradient-to-t", item.color)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                />
              )}
            </motion.div>
          );

          if (isShare) {
            return (
              <div key={item.path} onClick={handleShare} className="relative group cursor-pointer">
                 <Content />
              </div>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              <a className="relative group">
                <Content />
                
                {/* Reflection/Shadow underneath when lifted */}
                {active && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full blur-md opacity-50",
                      item.iconColor.replace('text-', 'bg-')
                    )}
                  />
                )}
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
