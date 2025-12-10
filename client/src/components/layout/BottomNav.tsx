import { Link, useLocation } from "wouter";
import { Gamepad2, Wallet, History, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      activeColor: 'text-green-400'
    },
    { 
      path: '/wallet', 
      label: 'Wallet', 
      icon: Wallet,
      activeColor: 'text-blue-400'
    },
    { 
      path: '/history', 
      label: 'History', 
      icon: History,
      activeColor: 'text-purple-400'
    }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 p-2 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative overflow-hidden">
        {/* Glossy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <a className="relative group px-6 py-3 flex flex-col items-center justify-center cursor-pointer min-w-[80px]">
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <motion.div
                    animate={{ 
                      scale: active ? 1.1 : 1,
                      y: active ? -2 : 0 
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={cn(
                      "relative",
                      active ? item.activeColor : "text-muted-foreground group-hover:text-white"
                    )}
                  >
                    <item.icon className={cn(
                      "h-7 w-7 transition-all duration-300",
                      active && "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    )} />
                    
                    {/* Active dot */}
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current shadow-[0_0_5px_currentColor]"
                        )}
                      />
                    )}
                  </motion.div>
                  
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider mt-1",
                        item.activeColor
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
