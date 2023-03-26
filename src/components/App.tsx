// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import React, { CSSProperties, useEffect, useState } from 'react';
import {MultiLayoutComponentId, State} from '../state/app-state'
import { Model } from '../state/model';
import EditorPanel from './EditorPanel';
import ViewerPanel from './ViewerPanel';
import Footer from './Footer';
import { ModelContext, FSContext } from './contexts';
import PanelSwitcher from './PanelSwitcher';

// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css"; 

export function App({initialState, fs}: {initialState: State, fs: FS}) {
  const [state, setState] = useState(initialState);
  
  const model = new Model(fs, state, setState);
  useEffect(() => model.init());

  const zIndexOfPanelsDependingOnFocus = {
    editor: {
      editor: 3,
      viewer: 1,
      customizer: 0,
    },
    viewer: {
      editor: 2,
      viewer: 3,
      customizer: 2,
    },
    customizer: {
      editor: 0,
      viewer: 0,
      customizer: 3,
    }
  }

  const layout = state.view.layout
  const mode = state.view.layout.mode;
  function getPanelStyle(id: MultiLayoutComponentId): CSSProperties {
    if (layout.mode === 'multi') {
      const itemCount = (layout.editor ? 1 : 0) + (layout.viewer ? 1 : 0) + (layout.customizer ? 1 : 0)
      return {
        flex: 1,
        maxWidth: Math.floor(100/itemCount) + '%',
        display: (state.view.layout as any)[id] ? 'flex' : 'none'
      }
    } else {
      return {
        flex: 1,
        zIndex: Number((zIndexOfPanelsDependingOnFocus as any)[id][layout.focus]),
      }
    }
  }
  
  // TODO: test this again:
  // body {
  //   min-height: 100vh;
  //   min-height: fill-available;
  //   min-height: -webkit-fill-available;
  // }
  // html {
  //     height: fill-available;
  //     height: -webkit-fill-available;
  // }
  const isIPhone = /iPhone/.test(navigator.userAgent)

  return (
    <ModelContext.Provider value={model}>
      <FSContext.Provider value={fs}>
        <div className='flex flex-column' style={{
            // height: '100vh'
            // maxHeight: '-webkit-fill-available',
            height: isIPhone ? "calc(100vh - 80px - env(safe-area-inset-bottom) - env(safe-area-inset-top))" : '100vh'
          }}>
          {isIPhone && <Footer />}
          
          <PanelSwitcher />
    
          <div className={mode === 'multi' ? 'flex flex-row' : 'flex flex-column'}
              style={mode === 'multi' ? {flex: 1} : {
                flex: 1,
                position: 'relative'
              }}>
                {/* {position: 'relative'}}> */}

            <EditorPanel className={`
              opacity-animated
              ${layout.mode === 'single' && layout.focus !== 'editor' ? 'opacity-0' : ''}
              ${layout.mode === 'single' ? 'absolute-fill' : ''}
            `} style={getPanelStyle('editor')} />
            <ViewerPanel className={layout.mode === 'single' ? `absolute-fill` : ''} style={getPanelStyle('viewer')} />
            {/* <CustomizerPanel className={`${getPanelClasses('customizer')} absolute-fill`} style={getPanelStyle('customizer')} /> */}
          </div>

          {!isIPhone && <Footer />}
        </div>
      </FSContext.Provider>
    </ModelContext.Provider>
  );
}

        // <Splitter style={{ flex: 1 }}>
        //     <SplitterPanel className="flex flex-column align-items-center justify-content-center">
        //       <EditorPanel />
        //     </SplitterPanel>
        //     <SplitterPanel className="flex flex-column align-items-center justify-content-center">
        //       <ViewerPanel/>
        //     </SplitterPanel>
        // </Splitter>
        // <Footer />