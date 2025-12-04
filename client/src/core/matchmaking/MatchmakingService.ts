import { MatchParams, Match, getQueueKey } from "@/core/types";

// Simulated shared state via localStorage to allow cross-tab matchmaking
const STORAGE_KEY_QUEUE = 'skillblitz_queue';
const STORAGE_KEY_MATCHES = 'skillblitz_matches';

type Queue = Record<string, MatchParams & { playerId: string, timestamp: number }>;

export class MatchmakingService {
  private static instance: MatchmakingService;

  private constructor() {}

  static getInstance(): MatchmakingService {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService();
    }
    return MatchmakingService.instance;
  }

  private getQueue(): Queue {
    const stored = localStorage.getItem(STORAGE_KEY_QUEUE);
    return stored ? JSON.parse(stored) : {};
  }

  private setQueue(queue: Queue) {
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  }

  // Find opponent or join queue
  // Returns valid match ID if paired immediately, or null if queued
  async findMatch(params: MatchParams, playerId: string): Promise<Match | null> {
    const key = getQueueKey(params.game, params.asset, params.stake);
    const queue = this.getQueue();

    // Check if someone else is waiting in this queue
    // For simplicity in prototype: specific key matching only
    // In real app: we'd lock the queue item, etc.
    
    // Filter out stale entries > 1 min? (Optional cleanup)
    
    // Look for an entry with DIFFERENT playerId
    const waitingEntries = Object.entries(queue).filter(([k, v]) => k.startsWith(key) && v.playerId !== playerId);

    if (waitingEntries.length > 0) {
      // Match found!
      const [waitingKey, opponent] = waitingEntries[0];
      
      // Remove opponent from queue
      delete queue[waitingKey];
      this.setQueue(queue);

      // Create Active Match
      const matchId = Math.random().toString(36).substring(7);
      const match: Match = {
        id: matchId,
        game: params.game,
        asset: params.asset,
        stake: params.stake,
        status: 'active',
        players: [opponent.playerId, playerId],
        startTime: Date.now()
      };

      // Save match to shared storage so opponent can see it
      const matches = this.getMatches();
      matches[matchId] = match;
      this.setMatches(matches);

      return match;
    } else {
      // No match found, add self to queue
      // Use a unique key for the queue entry so we don't overwrite? 
      // Or just one slot per game/asset/stake?
      // Ideally queue is a list.
      // Let's make the key unique: key + timestamp
      const uniqueKey = `${key}:${Date.now()}`;
      queue[uniqueKey] = { ...params, playerId, timestamp: Date.now() };
      this.setQueue(queue);
      return null; 
    }
  }

  cancelSearch(params: MatchParams, playerId: string) {
    const queue = this.getQueue();
    const keyPrefix = getQueueKey(params.game, params.asset, params.stake);
    
    // Remove all entries for this player in this bucket
    Object.keys(queue).forEach(k => {
      if (k.startsWith(keyPrefix) && queue[k].playerId === playerId) {
        delete queue[k];
      }
    });
    this.setQueue(queue);
  }

  // Poll for match status (used by the waiting player)
  checkForMatch(playerId: string): Match | null {
    const matches = this.getMatches();
    const found = Object.values(matches).find(m => 
      (m.status === 'active' || m.status === 'finished') && 
      m.players.includes(playerId)
    );
    return found || null;
  }

  private getMatches(): Record<string, Match> {
    const stored = localStorage.getItem(STORAGE_KEY_MATCHES);
    return stored ? JSON.parse(stored) : {};
  }

  private setMatches(matches: Record<string, Match>) {
    localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
  }
  
  // Helper to clean up for testing
  reset() {
    localStorage.removeItem(STORAGE_KEY_QUEUE);
    localStorage.removeItem(STORAGE_KEY_MATCHES);
  }
}

export const matchmakingService = MatchmakingService.getInstance();
