import React from 'react';
import { WBComponent } from './WBComponent';
import { WBSplit } from './WBSplit';
import { IWBLayout } from './IWBLayout';

export interface IWBProps {
  components: Record<string, any>;
  current: IWBLayout;
  parent?: IWBLayout;
  width: number;
  height: number;
  left: number;
  top: number;

  onLayoutChange: (layout: IWBLayout) => void;
}

export const WBLayout = ({ components, current, parent, width, height, left, top, onLayoutChange }: IWBProps) => {
  if (current.type === 'Component') {
    return (
      <WBComponent
        key={current.key}
        components={components}
        current={current}
        parent={parent}
        width={width}
        height={height}
        left={left}
        top={top}
      />
    );
  }

  if (current.type === 'Split') {
    return (
      <WBSplit
        key={current.key}
        components={components}
        current={current}
        parent={parent}
        width={width}
        height={height}
        left={left}
        top={top}
        onLayoutChange={onLayoutChange}
      />
    );
  }

  return null;
};
