/* eslint-disable react-hooks/refs */
import React, { useRef, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/store";
import { updateLayer, setSelectedLayer } from "../../store/editorSlice";
import Moveable from "react-moveable";
import { VideoLayer } from "../Layers/VideoLayer/VideoLayer";
import { ImageLayer } from "../Layers/ImageLayer/ImageLayer";
import { TextLayer } from "../Layers/TextLayer/TextLayer";
import { getAspectRatio } from "../../utils/geometry";

export const Stage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { layers, stage, currentTime, selectedLayerId } = useAppSelector(
    (state) => state.editor
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Filter layers visible at current time
  const visibleLayers = useMemo(() => {
    return layers
      .filter(
        (layer) =>
          currentTime >= layer.timeline.start &&
          currentTime <= layer.timeline.end
      )
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [layers, currentTime]);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const targetRef = useRef<HTMLElement | null>(null);

  // Update target ref when selection changes
  useEffect(() => {
    if (selectedLayerId) {
      const el = document.getElementById(`layer-${selectedLayerId}`);
      targetRef.current = el;
    } else {
      targetRef.current = null;
    }
  }, [selectedLayerId, visibleLayers]);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !stageRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Fixed resolution
      const targetWidth = 1920;
      const targetHeight = 1080;

      const scaleX = containerWidth / targetWidth;
      const scaleY = containerHeight / targetHeight;
      const scale = Math.min(scaleX, scaleY) * 0.9;

      stageRef.current.style.transform = `scale(${scale})`;
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial calculation

    // Observe container resize as well
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [stage.aspectRatio]);

  const aspectRatio = getAspectRatio(stage.aspectRatio);

  let stageWidth = 1920;
  let stageHeight = 1080;

  if (aspectRatio > 1.77) {
    stageWidth = 1920;
    stageHeight = 1920 / aspectRatio;
  } else {
    stageHeight = 1080;
    stageWidth = 1080 * aspectRatio;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-gray-950 overflow-hidden"
    >
      <div
        ref={stageRef}
        className="relative bg-white shadow-2xl flex-shrink-0"
        style={{
          width: `${stageWidth}px`,
          height: `${stageHeight}px`,
          transformOrigin: "center",
        }}
        onMouseDown={(e) => {
          if (e.target === stageRef.current) {
            dispatch(setSelectedLayer(null));
          }
        }}
      >
        {visibleLayers.map((layer) => (
          <div
            key={layer.id}
            id={`layer-${layer.id}`}
            className={`absolute cursor-pointer ${
              selectedLayerId === layer.id ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              left: `${layer.geometry.x * 100}%`,
              top: `${layer.geometry.y * 100}%`,
              width: `${layer.geometry.width * 100}%`,
              height: `${layer.geometry.height * 100}%`,
              transform: `rotate(${layer.options.styles?.rotation || 0}deg)`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              dispatch(setSelectedLayer(layer.id));
            }}
          >
            {layer.type === "video" && (
              <VideoLayer layer={layer} currentTime={currentTime} />
            )}
            {layer.type === "image" && <ImageLayer layer={layer} />}
            {layer.type === "text" && <TextLayer layer={layer} />}
          </div>
        ))}

        {selectedLayerId && (
          <Moveable
            target={document.getElementById(`layer-${selectedLayerId}`)}
            container={stageRef.current}
            draggable={true}
            resizable={true}
            rotatable={true}
            onDrag={(e) => {
              e.target.style.transform = e.transform;
            }}
            onResize={(e) => {
              e.target.style.width = `${e.width}px`;
              e.target.style.height = `${e.height}px`;
              e.target.style.transform = e.drag.transform;
            }}
            onRotate={(e) => {
              e.target.style.transform = e.drag.transform;
            }}
            onDragEnd={(e) => {
              if (!stageRef.current || !selectedLayer) return;
              const containerRect = stageRef.current.getBoundingClientRect();

              const targetRect = e.target.getBoundingClientRect();

              const x =
                (targetRect.left - containerRect.left) / containerRect.width;
              const y =
                (targetRect.top - containerRect.top) / containerRect.height;

              dispatch(
                updateLayer({
                  id: selectedLayer.id,
                  changes: {
                    geometry: {
                      ...selectedLayer.geometry,
                      x,
                      y,
                    },
                  },
                })
              );
              e.target.style.transform = `rotate(${
                selectedLayer.options.styles?.rotation || 0
              }deg)`;
            }}
            onResizeEnd={(e) => {
              if (!stageRef.current || !selectedLayer) return;
              const containerRect = stageRef.current.getBoundingClientRect();
              const targetRect = e.target.getBoundingClientRect();

              const x =
                (targetRect.left - containerRect.left) / containerRect.width;
              const y =
                (targetRect.top - containerRect.top) / containerRect.height;
              const width = targetRect.width / containerRect.width;
              const height = targetRect.height / containerRect.height;

              dispatch(
                updateLayer({
                  id: selectedLayer.id,
                  changes: {
                    geometry: {
                      x,
                      y,
                      width,
                      height,
                    },
                  },
                })
              );
            }}
            onRotateEnd={(e) => {
              if (!selectedLayer) return;
              const match = e.target.style.transform.match(
                /rotate\(([-\d.]+)deg\)/
              );
              if (match) {
                const rotation = parseFloat(match[1]);
                dispatch(
                  updateLayer({
                    id: selectedLayer.id,
                    changes: {
                      options: {
                        ...selectedLayer.options,
                        styles: {
                          ...selectedLayer.options.styles,
                          rotation,
                        },
                      },
                    },
                  })
                );
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
