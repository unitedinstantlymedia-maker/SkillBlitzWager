import React, { createContext, useContext, useReducer } from 'react';
import { 
  GameState, 
  GameAction, 
  AssetType,
  PLATFORM_FEE_PERCENT 
} from '../lib/types';
import { walletAdapter } from '@/core/wallet/WalletAdapter';
import { escrowAdapter } from '@/core/escrow/EscrowAdapter';
import { matchmakingService } from '@/core/matchmaking/MatchmakingService';
import { SUPPORTED_ASSETS } from '@/config/escrow';

// --- Initial State ---
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
// We need to move some logic out of reducer to async actions in the provider
// But for now, we can keep the reducer for state updates and use a wrapper for async calls
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CONNECT_WALLET':
      // This is now just setting the state, the actual connection logic happens in the wrapper
      // But to keep the pattern simple for this refactor without rewriting the whole app to use thunks:
      // We will assume the payload contains the wallet state if it's an update, or we handle it in the wrapper.
      // Let's change the action to accept payload for CONNECT_WALLET
      return {
        ...state,
        wallet: {
          ...state.wallet,
          connected: true,
          address: (action as any).payload?.address || '0x71C...9A21',
          balances: (action as any).payload?.balances || { USDT: 0, ETH: 0, TON: 0 }
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
        // Deduct network fee from balance immediately for UI feedback (Mock only)
        wallet: {
          ...state.wallet,
          balances: {
            ...state.wallet.balances,
            // We need to deduct the network fee here? 
            // Or we rely on the wrapper to dispatch a specific balance update?
            // Let's do it in the wrapper and just update match state here.
          }
        },
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
      // Payout/fee logic is now handled by EscrowAdapter, passed via payload
      const { payout, fee, netProfit } = (action as any).payload;

      // Update user balances
      const newBalances = { ...state.wallet.balances };
      // Note: Stake was already "locked" (deducted conceptually or literally). 
      // In the mock, we haven't strictly deducted the stake from the displayed balance yet?
      // The prompt says "deduct [network fee] ... before allowing match to start".
      // The stake is usually deducted/locked.
      // Let's assume the mock wallet adapter handles "locking" by deducting.
      // If we assume stake was deducted at START_MATCH (or Match Found), then we add Payout.
      // If we assume stake was NOT deducted, we calculate diff.
      
      // For simplicity in this prototype refactor:
      // We will apply the net profit/loss to the balance here.
      // If Win: Balance += (Payout - Stake) -> Net Profit
      // If Loss: Balance -= Stake
      
      // Wait, `netProfit` from adapter is `Payout - Stake`.
      // So newBalance = oldBalance + netProfit.
      newBalances[state.selectedAsset] += netProfit;

      // Update platform fees
      const newFees = { ...state.platformFeesCollected };
      newFees[state.selectedAsset] += fee;

      const historyItem = {
        id: state.currentMatch.id,
        game: state.selectedGame!,
        asset: state.selectedAsset,
        stake: state.stakeAmount,
        result,
        pot: state.stakeAmount * 2,
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
    case 'UPDATE_BALANCES': 
       // Helper action for sync
       return {
         ...state,
         wallet: {
           ...state.wallet,
           balances: (action as any).payload
         }
       };
    default:
      return state;
  }
}

// --- Context ---
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  actions: {
    connectWallet: () => Promise<void>;
    startMatch: () => Promise<void>;
    finishMatch: (result: 'win' | 'loss') => Promise<void>;
  }
} | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const actions = {
    connectWallet: async () => {
      const walletState = await walletAdapter.connect();
      // We need to cast action type to any because we added payload to CONNECT_WALLET dynamically
      dispatch({ type: 'CONNECT_WALLET', payload: walletState } as any);
    },
    startMatch: async () => {
      if (!state.selectedGame) return;

      // 1. Deduct Network Fee (Mock)
      const networkFee = escrowAdapter.getEstimatedNetworkFee(state.selectedAsset);
      const currentBalance = state.wallet.balances[state.selectedAsset];
      
      if (currentBalance < networkFee + state.stakeAmount) {
        // Should actully handle error, but UI prevents this usually
        console.error("Insufficient balance for stake + network fee");
        return;
      }

      // Update balance to show deduction
      const newBalances = { ...state.wallet.balances };
      newBalances[state.selectedAsset] -= networkFee;
      dispatch({ type: 'UPDATE_BALANCES', payload: newBalances } as any);

      // 2. Create/Join Match (Escrow)
      const matchParams = {
        game: state.selectedGame,
        asset: state.selectedAsset,
        stake: state.stakeAmount,
        playerAddress: state.wallet.address || '0x...'
      };
      
      const { matchId } = await escrowAdapter.createOrJoinMatch(matchParams);
      dispatch({ type: 'START_MATCH', payload: { id: matchId } });

      // 3. Find Match (Matchmaking)
      const { opponent } = await matchmakingService.findMatch({
        game: state.selectedGame,
        asset: state.selectedAsset,
        amount: state.stakeAmount
      });
      
      dispatch({ type: 'FOUND_OPPONENT', payload: { opponent } });
    },
    finishMatch: async (result: 'win' | 'loss') => {
      if (!state.currentMatch) return;

      // 4. Settle Match (Escrow)
      const settlement = await escrowAdapter.settleMatch(
        { matchId: state.currentMatch.id, winnerAddress: result === 'win' ? state.wallet.address! : '0xOpponent' },
        state.stakeAmount,
        state.selectedAsset
      );

      dispatch({ 
        type: 'FINISH_GAME', 
        payload: { 
          result, 
          payout: settlement.payoutAmount,
          fee: settlement.feeAmount,
          netProfit: settlement.netProfit 
        } 
      } as any);
    }
  };

  return (
    <GameContext.Provider value={{ state, dispatch, actions }}>
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
