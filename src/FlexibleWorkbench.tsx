import React, { useRef } from 'react';
import { IWBConfigData, IWBLayout, IWBLayoutComponent } from './IWBLayout';
import cx from 'classnames';
import './style.less';
import { FWContext, IFWContext, IFWEvt } from './FWContext';
import _ from 'lodash';
import { EventBus } from 'ah-event-bus';
import { FlexibleLayout } from './FlexibleLayout';
import { useForceUpdate } from './useForceUpdate';
import { useListen } from './useListen';
import { useHandler } from './useHandler';
import { theme } from 'antd';
import { FlexibleSidePanelContainer } from './FlexibleSidePanelContainer';

export interface IFlexibleWorkbenchProps {
  className?: string;
  style?: React.CSSProperties;

  renderIcon?: (layout: IWBLayout) => any;
  renderTitle?: (layout: IWBLayout) => any;

  onComponentProps?: (layout: IWBLayoutComponent) => any;

  components: Record<string, any>;
  config: IWBConfigData;
  onConfigChange: (config: IWBConfigData, skipRefresh?: boolean) => any;
  onEnterPanel?: (layout: IWBLayoutComponent) => any;
}

export const DefaultRenderTitle = (layout: IWBLayout) => {
  if (layout.type === 'Component') return layout.component;
  if (layout.type === 'Split') return layout.key;
  return '<Unknown>';
};

export const FlexibleWorkbench = ({
  className,
  style,
  config,
  onConfigChange,
  renderIcon,
  components,
  renderTitle = DefaultRenderTitle,
  onComponentProps,
  onEnterPanel = () => {},
}: IFlexibleWorkbenchProps) => {
  const eventRef = useRef(new EventBus<IFWEvt>());
  const { token } = theme.useToken();

  const fu = useForceUpdate();

  const handleConfigChange = useHandler(onConfigChange);
  const handleOverPanel = useHandler(onEnterPanel);

  useListen(eventRef.current, 'afterConfigChange', ev => {
    if (!ev.skipRefresh) {
      fu.update();
    }

    handleConfigChange({ ...config }, ev.skipRefresh);
  });

  useListen(eventRef.current, 'afterEnterPanel', ev => {
    handleOverPanel(ev.item);
  });

  const ctx: IFWContext = {
    components,
    config,
    event: eventRef.current,
    currentLayout: config.layout,
    renderTitle,
    renderIcon,
    onComponentProps,
  };

  return (
    <div
      data-name='FlexibleWorkbench'
      className={cx('FW', className)}
      style={
        {
          '--colorBorderSecondary': token.colorBorderSecondary,
          ...style,
        } as any
      }
    >
      <FWContext.Provider value={ctx}>
        <FlexibleSidePanelContainer className='side' />
        <FlexibleLayout className='split' />
      </FWContext.Provider>
    </div>
  );
};
