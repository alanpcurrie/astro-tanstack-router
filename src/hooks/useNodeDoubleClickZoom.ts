import { useCallback } from 'react';
import { useReactFlow, type NodeMouseHandler } from '@xyflow/react';

type UseNodeDoubleClickZoomOptions = {
  zoomLevel?: number;
  duration?: number;
}


export function useNodeDoubleClickZoom(options: UseNodeDoubleClickZoomOptions = {}) {
  const { 
    zoomLevel = 1.85, 
    duration = 800
  } = options;
  
  const reactFlowInstance = useReactFlow();
  
  const onNodeDoubleClick: NodeMouseHandler = useCallback(
    (_, node) => {

      const nodeX = node.position.x + (node.width || 150) / 2;
      const nodeY = node.position.y + (node.height || 50) / 2;
      
      reactFlowInstance.setViewport(
        {
          x: -nodeX * zoomLevel + window.innerWidth / 2,
          y: -nodeY * zoomLevel + window.innerHeight / 2,
          zoom: zoomLevel
        },
        { duration }
      );
      
      console.log(`Zoomed to node: ${node.id} at zoom level ${zoomLevel}`);
      
      return node;
    },
    [reactFlowInstance, zoomLevel, duration]
  );
  
  return onNodeDoubleClick;
}
