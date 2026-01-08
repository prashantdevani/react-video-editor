import React from 'react';
import type { Layer } from '../../../types';

interface ImageLayerProps {
  layer: Layer;
}

export const ImageLayer: React.FC<ImageLayerProps> = ({ layer }) => {
  return (
    <img
      src={layer.options.imageUrl}
      alt="layer"
      className="w-full h-full object-contain pointer-events-none select-none"
      style={{
        opacity: layer.options.styles?.opacity ?? 1,
      }}
    />
  );
};
