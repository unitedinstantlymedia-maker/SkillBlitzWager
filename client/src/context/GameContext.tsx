import React, { createContext, useContext, useReducer } from 'react';
import { 
  GameState, 
  GameAction, 
  UserWallet,
  PLATFORM_FEE_PERCENT 
} from '../lib/types';

// --- Initial State ---
// Balances start at 0, simulated wallet connection will populate them
const initialState: GameState = {
  selectedGame: null,
  selectedAsset: 'USDT',
  stakeAmount: 20,
  wallet: {
    connected: false,
    address: null,
    balances: {
      USDT: 0,
      ETH: 0,
      TON: 0
    }
  },
  currentMatch: null,
  history: [],
  platformFeesCollected: {
    USDT: 0,
    ETH: 0,
    TON: 0
  }
};

// --- Reducer ---
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          connected: true,
          address: '0x71C...9A21',
          balances: {
            USDT: 100, // Mock balance upon connection
            ETH: 0.2,   // Mock balance upon connection
            TON: 50    // Mock balance upon connection
          }
        }
      };
    case 'SELECT_GAME':
      return { ...state, selectedGame: action.payload };
    case 'SELECT_ASSET':
      return { ...state, selectedAsset: action.payload };
    case 'SET_STAKE':
      return { ...state, stakeAmount: action.payload };
    case 'START_MATCH':
      return {
        ...state,
        currentMatch: {
          id: action.payload.id,
          status: 'finding',
          opponent: null,
          startTime: Date.now(),
          result: null,
          payout: null,
          fee: null
        }
      };
    case 'FOUND_OPPONENT':
      if (!state.currentMatch) return state;
      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          status: 'playing',
          opponent: action.payload.opponent
        }
      };
    case 'FINISH_GAME':
      if (!state.currentMatch) return state;
      
      const result = action.payload.result;
      const stake = state.stakeAmount;
      const pot = stake * 2;
      const fee = (pot * PLATFORM_FEE_PERCENT) / 100;
      const payout = result === 'win' ? pot - fee : 0;
      
      // Update user balances
      const newBalances = { ...state.wallet.balances };
      if (result === 'win') {
        newBalances[state.selectedAsset] += (payout - stake); // Net gain
      } else {
        newBalances[state.selectedAsset] -= stake; // Loss
      }

      // Update platform fees
      const newFees = { ...state.platformFeesCollected };
      newFees[state.selectedAsset] += fee;

      const historyItem = {
        id: state.currentMatch.id,
        game: state.selectedGame!,
        asset: state.selectedAsset,
        stake: state.stakeAmount,
        result,
        pot,
        fee,
        payout,
        timestamp: Date.now()
      };

      return {
        ...state,
        wallet: {
          ...state.wallet,
          balances: newBalances
        },
        currentMatch: {
          ...state.currentMatch,
          status: 'finished',
          result,
          payout,
          fee
        },
        history: [historyItem, ...state.history],
        platformFeesCollected: newFees
      };
      
    case 'RESET_MATCH':
      return {
        ...state,
        currentMatch: null
      };
    default:
      return state;
  }
}

// --- Context ---
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
