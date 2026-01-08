import React from 'react';
import type { Layer } from '../../../types';

interface TextLayerProps {
  layer: Layer;
}

export const TextLayer: React.FC<TextLayerProps> = ({ layer }) => {
  const { styles } = layer.options;
  return (
    <div
      className="w-full h-full flex items-center justify-center pointer-events-none select-none whitespace-pre-wrap"
      style={{
        color: styles?.color || '#000000',
        opacity: styles?.opacity ?? 1,
        backgroundColor: styles?.background?.color ? styles.background.color : 'transparent',
        border: styles?.border ? `${styles.border.width}px ${styles.border.style} ${styles.border.color}` : 'none',
        textShadow: styles?.shadow ? `${styles.shadow.x}px ${styles.shadow.y}px ${styles.shadow.blur}px ${styles.shadow.color}` : 'none',
        fontSize: styles?.fontSize ? `${styles.fontSize}px` : '100%', // scalable with container? or fixed? usually scalable in transform box
      }}
    >
      {layer.options.text}
    </div>
  );
};
