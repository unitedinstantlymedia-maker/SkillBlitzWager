import { AssetType } from "@/lib/types";

export interface WalletState {
  connected: boolean;
  address: string | null;
  balances: Record<AssetType, number>;
}

export interface IWalletAdapter {
  connect(): Promise<WalletState>;
  disconnect(): Promise<void>;
  getBalances(address: string): Promise<Record<AssetType, number>>;
}

export class MockWalletAdapter implements IWalletAdapter {
  private mockState: WalletState = {
    connected: false,
    address: null,
    balances: {
      USDT: 0,
      ETH: 0,
      TON: 0
    }
  };

  async connect(): Promise<WalletState> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.mockState = {
      connected: true,
      address: '0x71C...9A21',
      balances: {
        USDT: 100,
        ETH: 0.2,
        TON: 50
      }
    };
    return this.mockState;
  }

  async disconnect(): Promise<void> {
    this.mockState = {
      connected: false,
      address: null,
      balances: { USDT: 0, ETH: 0, TON: 0 }
    };
  }

  async getBalances(address: string): Promise<Record<AssetType, number>> {
    // In a real app, this would fetch from chain
    // For mock, we return the internal mock state
    return this.mockState.balances;
  }
}

export const walletAdapter = new MockWalletAdapter();
