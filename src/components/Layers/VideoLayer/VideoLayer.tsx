import React, { useEffect, useRef } from 'react';
import type { Layer } from '../../../types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoLayerProps {
  layer: Layer;
  currentTime: number;
}

export const VideoLayer: React.FC<VideoLayerProps> = ({ layer, currentTime }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const { options } = layer;

  // Initialize Video.js
  useEffect(() => {
    if (!containerRef.current) return;

    if (!playerRef.current) {
        // Create video element dynamically to avoid React Strict Mode double-mount issues causing element loss
        const videoElement = document.createElement("video-js");
        videoElement.classList.add('vjs-big-play-centered', 'w-full', 'h-full', 'object-cover', 'pointer-events-none', 'select-none');
        containerRef.current.appendChild(videoElement);

        const player = videojs(videoElement, {
            controls: false,
            autoplay: false,
            preload: 'auto',
            muted: options.mute,
            fill: true,
            sources: options.videoUrl ? [{
                src: options.videoUrl,
                type: 'video/mp4'
            }] : []
        });
        playerRef.current = player;
    } else {
        const player = playerRef.current;
        if(options.videoUrl && player.currentSrc() !== options.videoUrl) {
            player.src({ src: options.videoUrl, type: 'video/mp4' });
        }
        player.muted(options.mute || false);
    }

  }, [options.videoUrl, options.mute]);

  // Dispose on unmount
  useEffect(() => {
    const player = playerRef.current;
    
    return () => {
        if (player && !player.isDisposed()) {
            player.dispose();
            playerRef.current = null;
        }
    };
  }, []);

  // Sync video time to global current time
  useEffect(() => {
    const player = playerRef.current;
    if (player && !player.isDisposed()) {
        const relativeTime = currentTime - layer.timeline.start;
        // Check if we are within bounds
        if (relativeTime >= 0 && relativeTime <= (layer.timeline.end - layer.timeline.start)) {
             const playerTime = player.currentTime();
             if (playerTime !== undefined && Math.abs(playerTime - relativeTime) > 0.3) {
                player.currentTime(relativeTime);
             }
        }
    }
  }, [currentTime, layer.timeline.start, layer.timeline.end]);

  return (
    <div data-vjs-player className="w-full h-full" ref={containerRef}> 
        {/* Video element will be injected here */}
    </div>
  );
};

