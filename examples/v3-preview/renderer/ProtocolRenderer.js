/**
 * ProtocolRenderer.js (Reference Implementation)
 * 
 * A lightweight, stateless renderer that maps Protocol JSON to UI Components.
 * This is the "Physiological System" of the Software-Defined Agent.
 */

import React from 'react';
import { StandardTable, DataCard, InputForm } from './components';

// 1. The Manifest: Mapping Protocol Strings to Real Code
const COMPONENT_MANIFEST = {
  'Standard_Table': StandardTable,
  'Data_Card': DataCard,
  'Input_Form': InputForm
};

export function ProtocolRenderer({ protocolJson, onIntentTrigger }) {
  if (!protocolJson || !protocolJson.component) {
    return <div className="error">Invalid Protocol Payload</div>;
  }

  const { component, props, data } = protocolJson;

  // 2. Safety Check: Does the renderer support this component?
  const TargetComponent = COMPONENT_MANIFEST[component];
  
  if (!TargetComponent) {
    console.warn(`[Renderer] Unknown component: ${component}`);
    return <div className="fallback">Unsupported Component: {component}</div>;
  }

  // 3. Intent Handler: The bridge between UI events and the Intent Router
  const handleIntent = (intent) => {
    const payload = {
      timestamp: Date.now(),
      intent: intent,
      source: {
        component: component,
        props_snapshot: props // Optional: Context for debugging
      }
    };
    
    // Pass to the Intent Router (See Intent_Router_Protocol.md)
    onIntentTrigger(payload);
  };

  // 4. Render: Inject props, data, and the intent handler
  return (
    <div className="protocol-component-wrapper">
      <TargetComponent 
        {...props} 
        data={data} 
        onAction={handleIntent} 
      />
    </div>
  );
}
