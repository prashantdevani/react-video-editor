import React, { useEffect, useRef } from "react";
import type { Layer } from "../../../types";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoLayerProps {
  layer: Layer;
  currentTime: number;
  isPlaying?: boolean;
  playbackSpeed?: number;
}

export const VideoLayer: React.FC<VideoLayerProps> = ({
  layer,
  currentTime,
  isPlaying,
  playbackSpeed = 1,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const { options } = layer;

  useEffect(() => {
    if (!containerRef.current) return;

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add(
        "vjs-big-play-centered",
        "w-full",
        "h-full",
        "object-cover",
        "pointer-events-none",
        "select-none"
      );
      containerRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        controls: false,
        autoplay: false,
        preload: "auto",
        muted: options.mute,
        fill: true,
        sources: options.videoUrl
          ? [
              {
                src: options.videoUrl,
                type: "video/mp4",
              },
            ]
          : [],
      });
      playerRef.current = player;
    } else {
      const player = playerRef.current;
      if (options.videoUrl && player.currentSrc() !== options.videoUrl) {
        player.src({ src: options.videoUrl, type: "video/mp4" });
      }
      player.muted(options.mute || false);
    }
  }, [options.videoUrl, options.mute]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (player && !player.isDisposed()) {
      player.playbackRate(playbackSpeed);
    }
  }, [playbackSpeed]);

  useEffect(() => {
    const player = playerRef.current;
    if (player && !player.isDisposed()) {
      const relativeTime = currentTime - layer.timeline.start;
      const duration = layer.timeline.end - layer.timeline.start;

      if (relativeTime >= 0 && relativeTime <= duration) {
        const playerTime = player.currentTime();
        const timeDiff = Math.abs(playerTime - relativeTime);

        if (isPlaying) {
          if (player.paused()) {
            player.play();
          }

          if (timeDiff > 0.5) {
            player.currentTime(relativeTime);
          }
        } else {
          if (!player.paused()) {
            player.pause();
          }

          if (timeDiff > 0.1) {
            player.currentTime(relativeTime);
          }
        }
      } else {
        if (!player.paused()) {
          player.pause();
          player.currentTime(0);
        }
      }
    }
  }, [currentTime, layer.timeline.start, layer.timeline.end, isPlaying]);

  return (
    <div data-vjs-player className="w-full h-full" ref={containerRef}>
      {/* Video element will be injected here */}
    </div>
  );
};
