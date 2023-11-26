import React from 'react';
import cx from 'classnames';
import { WBLayout } from './WBLayout';
import { cloneDeep } from 'lodash';
import { WBUtil } from './WBUtil';
import { IWBLayout, IWBSplit } from './IWBLayout';

export interface IWBSplitProps {
  className?: string;
  style?: React.CSSProperties;

  components: Record<string, any>;
  current: IWBSplit;
  parent?: IWBLayout;
  width: number;
  height: number;
  left: number;
  top: number;

  onLayoutChange: (layout: IWBLayout) => void;
}

const GUTTER_SIZE = 8;

export const WBSplit = ({ className, style, components, current, parent, width, height, left, top, onLayoutChange }: IWBSplitProps) => {
  const sizeType = current.direction === 'vertical' ? 'height' : 'width';
  const offsetType = current.direction === 'vertical' ? 'top' : 'left';
  const totalSize = (sizeType === 'height' ? height : width) - (current.children.length - 1) * GUTTER_SIZE;

  const handleGutterMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    ev.preventDefault();
    ev.stopPropagation();

    const ele = ev.currentTarget;
    ele.classList.add('active');

    const startOffset = ev[current.direction === 'vertical' ? 'clientY' : 'clientX'];
    const startConfig = cloneDeep(current.config);

    const _mouseMove = (_ev: MouseEvent) => {
      const endOffset = _ev[current.direction === 'vertical' ? 'clientY' : 'clientX'];
      const movement = endOffset - startOffset;

      current.config = cloneDeep(startConfig);
      WBUtil.moveSplit(current.config, index, totalSize, movement);

      onLayoutChange({ ...current });
    };

    const _mouseUp = () => {
      document.removeEventListener('mousemove', _mouseMove);
      document.removeEventListener('mouseup', _mouseUp);

      ele.classList.remove('active');
    };

    document.addEventListener('mousemove', _mouseMove);
    document.addEventListener('mouseup', _mouseUp);
  };

  const renderChildren = () => {
    const sizeList = WBUtil.calcSplitSize(current.config, totalSize);
    const offsetList: number[] = Array(current.children.length).fill(0);

    // 计算面板的偏移量
    for (let i = 1; i < current.children.length; i++) {
      offsetList[i] = offsetList[i - 1] + sizeList[i - 1] + GUTTER_SIZE;
    }

    const elements: any[] = [];

    for (let i = 0; i < current.children.length; i++) {
      const _c = current.children[i];
      const _size = sizeList[i];
      const _offset = offsetList[i];

      elements.push(
        <WBLayout
          key={_c.key}
          components={components}
          current={_c}
          parent={current}
          width={sizeType === 'width' ? _size : width}
          height={sizeType === 'height' ? _size : height}
          left={offsetType === 'left' ? _offset : 0}
          top={offsetType === 'top' ? _offset : 0}
          onLayoutChange={_c2 => {
            current.children[i] = _c2;
            onLayoutChange({ ...current });
          }}
        />
      );

      if (i < current.children.length - 1) {
        elements.push(
          <div
            key={`gutter-${_c.key}`}
            className='gutter'
            style={{ [sizeType]: GUTTER_SIZE, [offsetType]: _offset + _size }}
            onMouseDown={ev => handleGutterMouseDown(ev, i)}
          />
        );
      }
    }

    return elements;
  };

  return (
    <div className={cx('FW-split', current.direction, className)} style={{ width, height, left, top, ...style }}>
      {renderChildren()}
    </div>
  );
};
