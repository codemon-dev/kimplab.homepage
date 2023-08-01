// GlobalStore.tsx (note the .tsx extension for TypeScript files)
import { createContext } from 'react';
import { ACTIONS } from './actions';
import { IImgInfo } from '@/config/interface';
import { IMG_TYPE } from '@/config/enum';

export type GlobalStoreState = {
  symbolImgMap: Map<string, IImgInfo>;
  exchangeImgMap: Map<string, IImgInfo>;
  etcImgMap: Map<string, IImgInfo>;
};

type GlobalStoreType = {
  state: GlobalStoreState;
  dispatch: React.Dispatch<Action>;
};

type Action = {
  type: ACTIONS;
  key: any;
  value?: any; // Optional for ADD_TO_MAP
};

// Define the initial state with the types
export const initialState: GlobalStoreState = {
  symbolImgMap: new Map<string, IImgInfo>(),
  exchangeImgMap: new Map<string, IImgInfo>(),
  etcImgMap: new Map<string, IImgInfo>(),
};

// Create the reducer function with the types
export const reducer = (state: GlobalStoreState, action: Action): GlobalStoreState => {
  switch (action.type) {
    case ACTIONS.ADD_IMG_INFO:
      if (!action.value || action.value.length === 0) {
        return state;
      }
      action.value.forEach((element: IImgInfo) => {
        if (action.key === IMG_TYPE.SYMBOL) {
          state.symbolImgMap.set(element.id, element);
        } else if (action.key === IMG_TYPE.EXCHANGE) {
          state.exchangeImgMap.set(element.id, element);
        } else if (action.key === IMG_TYPE.ETC) {
          state.etcImgMap.set(element.id, element);
        }
      })
      return state;
    default:
      return state;
  }
};

// Create the global store context
export const GlobalStoreContext = createContext<GlobalStoreType | undefined>(undefined);
  