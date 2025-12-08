import { MatchParams, Match, getQueueKey } from "@/core/types";

const STORAGE_KEY_QUEUE = 'skillblitz_queue';
const STORAGE_KEY_MATCHES = 'skillblitz_matches';

type QueueEntry = MatchParams & { playerId: string, timestamp: number };
type Queue = Record<string, QueueEntry>;

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

  private getMatches(): Record<string, Match> {
    const stored = localStorage.getItem(STORAGE_KEY_MATCHES);
    return stored ? JSON.parse(stored) : {};
  }

  private setMatches(matches: Record<string, Match>) {
    localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
  }

  // Add player to queue
  enqueue(params: MatchParams, playerId: string): void {
    const queue = this.getQueue();
    const key = getQueueKey(params.game, params.asset, params.stake);
    const uniqueKey = `${key}:${playerId}`; // Use playerId to prevent duplicate entries from same player? Or allow re-queue?
    
    // Check if already in queue to avoid duplicates
    if (queue[uniqueKey]) return;

    queue[uniqueKey] = { ...params, playerId, timestamp: Date.now() };
    this.setQueue(queue);
    console.log(`[Matchmaking] Enqueued: ${uniqueKey}`);
  }

  // Try to find a match for the player
  tryMatch(params: MatchParams, playerId: string): Match | null {
    const queue = this.getQueue();
    const key = getQueueKey(params.game, params.asset, params.stake);

    // Look for an entry with DIFFERENT playerId in the same bucket
    const waitingEntries = Object.entries(queue).filter(([k, v]) => k.startsWith(key + ":") && v.playerId !== playerId);

    if (waitingEntries.length > 0) {
      // Match found!
      const [waitingKey, opponent] = waitingEntries[0];
      
      // Remove opponent from queue
      delete queue[waitingKey];
      // Remove self from queue if present
      const selfKey = `${key}:${playerId}`;
      if (queue[selfKey]) delete queue[selfKey];

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

      console.log(`[Matchmaking] Match Created: ${matchId}`);
      return match;
    }

    return null;
  }

  cancel(params: MatchParams, playerId: string): void {
    const queue = this.getQueue();
    const key = getQueueKey(params.game, params.asset, params.stake);
    const uniqueKey = `${key}:${playerId}`;
    
    if (queue[uniqueKey]) {
      delete queue[uniqueKey];
      this.setQueue(queue);
      console.log(`[Matchmaking] Cancelled: ${uniqueKey}`);
    }
  }

  // Helper for polling to see if we got matched by someone else
  checkForMatch(playerId: string): Match | null {
    const matches = this.getMatches();
    // Look for active matches where I am a player
    // TODO: Filter out old matches?
    const found = Object.values(matches).find(m => 
      (m.status === 'active' || m.status === 'finished') && 
      m.players.includes(playerId)
    );
    return found || null;
  }
}

export const matchmakingService = MatchmakingService.getInstance();
