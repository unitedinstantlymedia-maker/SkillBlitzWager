import { Link, useLocation } from "wouter";
import { Gamepad2, Wallet, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/games' && (location === '/' || location.startsWith('/games') || location.startsWith('/lobby'))) return true;
    return location === path;
  };

  const navItems = [
    { 
      path: '/games', 
      label: 'Play', 
      icon: Gamepad2,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/50',
      glowColor: 'shadow-green-500/50',
      iconColor: 'text-green-400'
    },
    { 
      path: '/wallet', 
      label: 'Wallet', 
      icon: Wallet,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      glowColor: 'shadow-blue-500/50',
      iconColor: 'text-blue-400'
    },
    { 
      path: '/history', 
      label: 'History', 
      icon: History,
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/50',
      glowColor: 'shadow-purple-500/50',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-4 p-2 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl relative">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <a className="relative group">
                <motion.div
                  className={cn(
                    "relative w-24 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300",
                    "border backdrop-blur-md shadow-lg cursor-pointer overflow-hidden",
                    active 
                      ? cn("bg-gradient-to-br border-2", item.color, item.borderColor, item.glowColor, "shadow-[0_0_20px_rgba(0,0,0,0.5)]") 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
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
                    active ? "text-white" : "text-muted-foreground group-hover:text-white"
                  )} />
                  
                  {/* Label */}
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest z-10 transition-colors duration-300",
                    active ? "text-white" : "text-muted-foreground group-hover:text-white"
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
