import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IWBLayout, IWBComponent } from './IWBLayout';
import cx from 'classnames';
import './style.less';
import _ from 'lodash';
import { WBLayout } from './WBLayout';

export interface IWorkbenchProps {
  className?: string;
  style?: React.CSSProperties;

  components: Record<string, any>;
  layout: IWBLayout;
  onChange?: (layout: IWBLayout) => any;
  onEnterPanel?: (layout: IWBComponent) => any;
}

export const Workbench = ({ className, style, layout, onChange, components }: IWorkbenchProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [bounding, setBounding] = useState<{ width: number; height: number }>();

  const [stash, setStash] = useState<IWBLayout>(layout);

  useEffect(() => {
    setStash(layout);
  }, [layout]);

  const reloadBounding = () => {
    if (!container.current) return;

    const { width, height } = container.current.getBoundingClientRect();
    setBounding({ width, height });
  };

  useLayoutEffect(() => {
    if (!container.current) return;

    reloadBounding();

    // 监听 container 的 resize 事件
    const ro = new ResizeObserver(() => reloadBounding());
    ro.observe(container.current);

    return () => {
      ro.disconnect();
    };
  }, []);

  const handleLayoutChange = (layout: IWBLayout) => {
    setStash(layout);
    onChange && onChange(layout);
  };

  const renderInner = () => {
    if (!bounding) return null;

    return (
      <div className={cx('FW', className)} style={{ ...bounding }}>
        <WBLayout
          components={components}
          current={stash}
          left={0}
          top={0}
          width={bounding.width}
          height={bounding.height}
          onLayoutChange={handleLayoutChange}
        />
      </div>
    );
  };

  return (
    <div ref={container} className={cx('FW-wrapper', className)} style={{ ...style }}>
      {renderInner()}
    </div>
  );
};
