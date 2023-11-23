import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FlexibleWorkbench, IWBConfigData, WBUtil } from '../src';

const App = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', padding: 16, boxSizing: 'border-box' }}>
      <FlexibleWorkbench
        components={{
          A: () => <div style={{ background: 'red' }}>A</div>,
          B: () => <div style={{ background: 'green' }}>B</div>,
          C: () => <div style={{ background: 'blue' }}>C</div>,
          D: () => <div style={{ background: 'yellow' }}>D</div>,
        }}
        config={{
          key: 'root',
          layout: WBUtil.createSplit(
            [
              WBUtil.createComponent('A'),
              WBUtil.createSplit(
                [WBUtil.createComponent('B'), WBUtil.createSplit([WBUtil.createComponent('C'), WBUtil.createComponent('D')])],
                'vertical',
                0.5
              ),
            ],
            'horizontal',
            0.5
          ),
        }}
        onConfigChange={function (config: IWBConfigData, skipRefresh?: boolean | undefined) {}}
      />
    </div>
  );
};

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
