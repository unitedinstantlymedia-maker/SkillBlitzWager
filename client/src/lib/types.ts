export type AssetType = 'USDT' | 'ETH' | 'TON';
export type GameType = 'Chess' | 'Tetris' | 'Checkers';

export interface UserWallet {
  connected: boolean;
  address: string | null;
  balances: Record<AssetType, number>;
}

export interface MatchParams {
  game: GameType;
  asset: AssetType;
  stake: number;
}

export interface MatchState {
  id: string;
  status: 'finding' | 'playing' | 'finished';
  opponent: string | null;
  startTime: number | null;
  result: 'win' | 'loss' | null;
  payout: number | null;
  fee: number | null;
}

export interface GameHistoryItem {
  id: string;
  game: GameType;
  asset: AssetType;
  stake: number;
  result: 'win' | 'loss';
  pot: number;
  fee: number;
  payout: number;
  timestamp: number;
}

export interface GameState {
  selectedGame: GameType | null;
  selectedAsset: AssetType;
  stakeAmount: number;
  wallet: UserWallet;
  currentMatch: MatchState | null;
  history: GameHistoryItem[];
  platformFeesCollected: Record<AssetType, number>;
}

export type GameAction = 
  | { type: 'CONNECT_WALLET' }
  | { type: 'SELECT_GAME'; payload: GameType }
  | { type: 'SELECT_ASSET'; payload: AssetType }
  | { type: 'SET_STAKE'; payload: number }
  | { type: 'START_MATCH'; payload: { id: string } }
  | { type: 'FOUND_OPPONENT'; payload: { opponent: string } }
  | { type: 'FINISH_GAME'; payload: { result: 'win' | 'loss' } }
  | { type: 'RESET_MATCH' }
  | { type: 'UPDATE_BALANCES'; payload: Record<AssetType, number> };

export const STAKE_PRESETS = [5, 20, 50, 100];
export const PLATFORM_FEE_PERCENT = 3;
// export const PLATFORM_COLD_WALLET_ADDRESS = "0xPLATFORM_COLD_WALLET_123"; // Backend integration placeholder
