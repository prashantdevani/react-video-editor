export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export type LayerType = "video" | "image" | "text";

export interface Geometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayerStyles {
  color?: string;
  opacity?: number;
  rotation?: number;
  fontSize?: number;
  border?: {
    color: string;
    width: number;
    style: "solid" | "dashed" | "dotted";
  };
  background?: {
    color: string;
    opacity: number;
  };
  shadow?: {
    color: string;
    opacity: number;
    blur: number;
    spread: number;
    x: number;
    y: number;
  };
}

export interface LayerOptions {
  videoUrl?: string;
  mute?: boolean;
  volume?: number;
  speed?: number;

  imageUrl?: string;

  text?: string;
  fontSize?: number;
  styles?: {
    color?: string;
    opacity?: number;
    rotation?: number;
    fontSize?: number;
    border?: {
      color: string;
      width: number;
      style: string;
    };
    background?: {
      color: string;
      opacity: number;
    };
    shadow?: {
      color: string;
      opacity: number;
      blur: number;
      spread: number;
      x: number;
      y: number;
    };
  };
}

export interface TimelineData {
  start: number;
  end: number;
}

export interface Layer {
  id: string;
  type: LayerType;
  name: string;
  zIndex: number;
  timeline: TimelineData;
  options: LayerOptions;
  geometry: Geometry;
}

export interface StageConfig {
  width: number;
  height: number;
  aspectRatio: AspectRatio;
}

export interface EditorState {
  stage: {
    aspectRatio: AspectRatio;
  };
  isLoading?: boolean;
  layers: Layer[];
  selectedLayerId: string | null;
  currentTime: number;
  isPlaying: boolean;
  duration: number;
}
