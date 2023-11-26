import { createContext } from 'react';
import { IWBComponent } from './IWBLayout';

export type IWBContext = {
  current: IWBComponent;
  width: number;
  height: number;
};

export const WBContext = createContext<IWBContext>(null as any);
