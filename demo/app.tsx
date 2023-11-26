import React, { useContext, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WBContext, Workbench, WBUtil } from '../src';

const LayoutData = {
  Normal: WBUtil.createSplit([
    WBUtil.createComponent('A'),
    WBUtil.createSplit([WBUtil.createComponent('B'), WBUtil.createSplit([WBUtil.createComponent('C'), WBUtil.createComponent('D')])]),
  ]),
  One: WBUtil.createComponent('A'),
  Four: WBUtil.createSplit(
    [
      WBUtil.createComponent('A'),
      WBUtil.createComponent('B'),
      WBUtil.createSplit(
        [WBUtil.createComponent('C'), WBUtil.createComponent('D')],
        [{ type: 'fixed', size: 100 }, { type: 'flex' }],
        'vertical'
      ),
    ],
    [{ type: 'fixed', size: 100 }, { type: 'flex' }, { type: 'flex' }]
  ),
};

const _createComponent = (name: string, color: string) => {
  return () => {
    const renderCnt = useRef(0);
    renderCnt.current++;

    const ctx = useContext(WBContext);

    return (
      <div style={{ width: '100%', height: '100%', background: color }}>
        <h3 style={{ marginTop: 0 }}>{name}</h3>
        <p>Render Count: {renderCnt.current}</p>
        <p>
          {ctx.width} x {ctx.height}
        </p>
      </div>
    );
  };
};

const components = {
  A: _createComponent('A', 'red'),
  B: _createComponent('B', 'green'),
  C: _createComponent('C', 'blue'),
  D: _createComponent('D', 'yellow'),
};

const App = () => {
  const [dataName, setDataName] = useState<keyof typeof LayoutData>('Normal');

  return (
    <div style={{ height: '100vh', width: '100vw', padding: 16, boxSizing: 'border-box' }}>
      <header style={{ height: 32 }}>
        <select value={dataName} onChange={ev => setDataName(ev.target.value as any)}>
          {Object.keys(LayoutData).map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </header>

      <Workbench components={components} layout={LayoutData[dataName]} style={{ height: 'calc(100% - 32px)' }} />
    </div>
  );
};

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
