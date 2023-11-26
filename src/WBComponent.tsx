import React, { useMemo, useRef } from 'react';
import cx from 'classnames';
import { Typography } from 'antd';
import { ErrorBoundary } from './ErrorBoundary';
import { IWBComponent, IWBLayout } from './IWBLayout';
import { WBContext } from './WBContext';

export interface IWBComponentProps {
  className?: string;
  style?: React.CSSProperties;

  components: Record<string, any>;
  current: IWBComponent;
  parent?: IWBLayout;
  width: number;
  height: number;
  left: number;
  top: number;
}

const NotFoundComponent = () => (
  <Typography.Text type='secondary' style={{ display: 'block', padding: 4 }}>
    面板未定义
  </Typography.Text>
);

export const WBComponent = ({ className, style, components, current, parent, width, height, left, top }: IWBComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const layout = current;
  const InnerComponent = components[layout.component] || NotFoundComponent;

  const cachedChildren = useMemo(() => {
    return (
      <WBContext.Provider value={{ width, height, current }}>
        <InnerComponent />
      </WBContext.Provider>
    );
  }, [width, height, current.key, current.component]);

  return (
    <div
      ref={ref}
      id={`FW-component-${layout.key}`}
      className={cx('FW-component', className)}
      onMouseEnter={() => {}}
      style={{ width, height, left, top, ...style }}
    >
      <ErrorBoundary key={layout.component}>{cachedChildren}</ErrorBoundary>
    </div>
  );
};
