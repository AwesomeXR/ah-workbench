import { sum } from 'lodash';
import { IWBLayout, IWBComponent, IWBSplit, IWBSplitDir, IWBSplitConfig } from './IWBLayout';

let uid = 0;

export const WBUtil = {
  randomID() {
    return 'wb_' + uid++;
  },

  walkLayout(entry: IWBLayout, tap: (cur: IWBLayout, parent?: IWBLayout) => 'stop' | void, parent?: IWBLayout) {
    const _walk = (_entry: IWBLayout, _tap: (cur: IWBLayout, parent?: IWBLayout) => 'stop' | void, _parent?: IWBLayout) => {
      const ret = _tap(_entry, _parent);
      if (ret === 'stop') throw new Error('__stop__');

      if (_entry.type === 'Component') return; // 结束

      if (_entry.type === 'Split') {
        _entry.children.forEach(child => this.walkLayout(child, _tap, _entry));
      }
    };

    try {
      _walk(entry, tap, parent);
    } catch (err) {
      if (err instanceof Error && err.message === '__stop__') return;
      throw err;
    }
  },

  createSplit(
    children: IWBLayout[],
    config: IWBSplitConfig[] = children.map(c => ({ type: 'flex' })),
    direction: IWBSplitDir = 'horizontal'
  ): IWBSplit {
    return { type: 'Split', key: this.randomID(), direction, children, config };
  },

  createComponent(component: string, query?: any): IWBComponent {
    return { type: 'Component', key: this.randomID(), component, query };
  },

  calcSplitSize(config: IWBSplit['config'], totalSize: number) {
    const sizeList: number[] = Array(config.length).fill(0);

    // 1. 填充 fixed size
    for (let i = 0; i < config.length; i++) {
      const c = config[i];
      if (c.type === 'fixed') sizeList[i] = c.size;
    }

    // 2. 填充 flex size
    const flexCount = sizeList.filter(s => s === 0).length;
    const flexPerSize = (totalSize - sum(sizeList)) / flexCount;
    for (let i = 0; i < config.length; i++) {
      const c = config[i];
      if (c.type === 'flex') sizeList[i] = flexPerSize;
    }

    return sizeList;
  },

  moveSplit(config: IWBSplit['config'], index: number, totalSize: number, movement: number) {
    const c1 = config[index];
    const c2 = config[index + 1];

    const minSize = 32;

    const sizeList = this.calcSplitSize(config, totalSize);
    const size1 = sizeList[index];
    const size2 = sizeList[index + 1];

    let replaceC1: IWBSplitConfig | undefined = undefined;

    if (c1.type === 'fixed' && c2.type === 'fixed') {
      const _m = movement > 0 ? Math.min(movement, size2 - minSize) : Math.max(movement, minSize - size1); // 防止超量

      c1.size = size1 + _m;
      c2.size = size2 - _m;
    }
    // [fixed, flex]
    else if (c1.type === 'fixed' && c2.type === 'flex') {
      const _m = Math.max(movement, minSize - size1); // 防止超量
      c1.size = size1 + _m;
    }
    // [flex, fixed]
    else if (c1.type === 'flex' && c2.type === 'fixed') {
      const _m = Math.min(movement, size2 - minSize); // 防止超量
      c2.size = size2 - _m;
    }
    // [flex, flex]
    else {
      // 上一个变为 fixed
      const _m = Math.max(movement, minSize - size1); // 防止超量
      replaceC1 = { type: 'fixed', size: size1 + _m };
    }

    if (replaceC1) config[index] = replaceC1;
  },
};
