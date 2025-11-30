import { useGame } from "@/context/GameContext";
import { GameType } from "@/lib/types";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const GAMES: { id: GameType; name: string; image: string; players: string }[] = [
  { 
    id: 'Chess', 
    name: 'Blitz Chess', 
    image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2658&auto=format&fit=crop',
    players: '1.2k playing'
  },
  { 
    id: 'Tetris', 
    name: 'Block Stack', 
    image: 'https://images.unsplash.com/photo-1596443686812-2f45229eebf3?q=80&w=2565&auto=format&fit=crop',
    players: '850 playing'
  },
  { 
    id: 'Checkers', 
    name: 'Checkers Pro', 
    image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=2525&auto=format&fit=crop',
    players: '430 playing'
  }
];

export default function Games() {
  const { dispatch } = useGame();
  const [, setLocation] = useLocation();

  const handleSelectGame = (gameId: GameType) => {
    dispatch({ type: 'SELECT_GAME', payload: gameId });
    setLocation('/lobby');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-glow">Select Game</h1>
      
      <div className="grid gap-4">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="group relative overflow-hidden cursor-pointer border-white/10 hover:border-primary/50 transition-colors"
              onClick={() => handleSelectGame(game.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${game.image})` }}
              />
              
              <CardContent className="relative z-20 p-6 h-32 flex flex-col justify-center">
                <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-white group-hover:text-primary transition-colors">
                  {game.name}
                </h2>
                <p className="text-sm text-muted-foreground font-mono mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {game.players}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
