import { GameType, AssetType } from "@/lib/types";

export interface MatchRequest {
  game: GameType;
  asset: AssetType;
  amount: number;
}

export class MatchmakingService {
  async findMatch(request: MatchRequest): Promise<{ opponent: string }> {
    // Simulate matchmaking delay and logic
    // Matches only on (game + asset + amount)
    
    // Stage 1: Search
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Stage 2: Verify
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stage 3: Found
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      opponent: '0x83B...29C1' // Mock opponent
    };
  }
}

export const matchmakingService = new MatchmakingService();
