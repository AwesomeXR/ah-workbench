export type IWBComponent = { key: string; type: 'Component'; component: string; query?: any };

export type IWBSplitDir = 'vertical' | 'horizontal';

export type IWBSplitConfig_Fixed = { type: 'fixed'; size: number };
export type IWBSplitConfig_Flex = { type: 'flex' };

export type IWBSplitConfig = IWBSplitConfig_Fixed | IWBSplitConfig_Flex;

export type IWBSplit = {
  key: string;
  type: 'Split';
  direction: IWBSplitDir;

  children: IWBLayout[];
  config: IWBSplitConfig[];
};

export type IWBLayout = IWBComponent | IWBSplit;
