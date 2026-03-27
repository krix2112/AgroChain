import { create } from 'zustand'
import type { Trade } from './types'

interface TradeState {
  trades: Trade[];
  activeTrade: Trade | null;
  isLoading: boolean;
}

interface TradeActions {
  setTrades: (trades: Trade[]) => void;
  setActiveTrade: (trade: Trade | null) => void;
  updateTradeState: (tradeId: string, newState: string) => void;
  addTrade: (trade: Trade) => void;
  setLoading: (bool: boolean) => void;
}

export const useTradeStore = create<TradeState & TradeActions>((set) => ({
  trades: [],
  activeTrade: null,
  isLoading: false,

  setTrades: (trades) => set({ trades }),

  setActiveTrade: (trade) => set({ activeTrade: trade }),

  updateTradeState: (tradeId, newState) => set((state) => ({
    trades: state.trades.map(trade => 
      trade.id === tradeId ? { ...trade, state: newState } : trade
    ),
    activeTrade: state.activeTrade?.id === tradeId ? { ...state.activeTrade, state: newState } : state.activeTrade
  })),

  addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),

  setLoading: (bool) => set({ isLoading: bool }),
}));