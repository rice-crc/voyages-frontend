import React, { useEffect, useRef } from 'react';
import { forceGraph } from './forceGraph.js';

const ForceGraphComponent = ({ data }) => {
  console.log('data', data)
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = forceGraph(data);
    if (canvasRef.current) {
      canvasRef.current.appendChild(canvas);
    }
  }, [data]);

  return <div ref={canvasRef}></div>;
};

export default ForceGraphComponent;
