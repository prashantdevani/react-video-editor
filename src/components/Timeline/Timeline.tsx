/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import {
  Timeline,
  type TimelineEffect,
  type TimelineRow,
} from "@xzdarcy/react-timeline-editor";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  setCurrentTime,
  updateLayer,
  setIsPlaying,
  setSelectedLayer,
  setPlaybackSpeed,
} from "../../store/editorSlice";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export const TimelineEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { layers, isPlaying, currentTime, duration, playbackSpeed } =
    useAppSelector((state) => state.editor);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineState = useRef<any>(null);
  const [timelineWidth, setTimelineWidth] = useState(1000);

  const [editorData, setEditorData] = useState<TimelineRow[]>([]);

  useEffect(() => {
    const rows: TimelineRow[] = layers.map((layer) => ({
      id: layer.id,
      actions: [
        {
          id: layer.id,
          start: layer.timeline.start,
          end: layer.timeline.end,
          effectId:
            layer.type === "video"
              ? "videoEffect"
              : layer.type === "image"
              ? "imageEffect"
              : "textEffect",
          data: {
            src:
              layer.options.videoUrl ||
              layer.options.imageUrl ||
              layer.options.text,
            name: layer.name,
          },
        },
      ],
    }));
    setEditorData(rows);
  }, [layers]);

  useEffect(() => {
    if (
      timelineState.current &&
      typeof timelineState.current.setTime === "function"
    ) {
      timelineState.current.setTime(currentTime);
    }
  }, [currentTime]);

  // Update width on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setTimelineWidth(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    if (isPlaying) {
      const startTime = Date.now();
      const startCurrentTime = currentTime;

      const animate = () => {
        const now = Date.now();
        const diff = ((now - startTime) / 1000) * playbackSpeed;
        const nextTime = startCurrentTime + diff;

        if (nextTime >= duration) {
          dispatch(setCurrentTime(duration));
          dispatch(setIsPlaying(false));
        } else {
          dispatch(setCurrentTime(nextTime));
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, playbackSpeed]); // Re-run when speed changes if playing, essentially restarting the anchor point.

  const handleActionMove = (action: any) => {
    const id = action.action.id;
    const start = action.start;
    const end = action.end;

    if (id) {
      dispatch(
        updateLayer({
          id: id,
          changes: {
            timeline: { start, end },
          },
        })
      );
    }
  };

  const togglePlay = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-900 text-white flex flex-col overflow-hidden"
    >
      <div className="flex items-center space-x-4 p-2 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => dispatch(setCurrentTime(0))}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={togglePlay}
          className="p-1 hover:bg-gray-700 rounded bg-blue-600"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() => dispatch(setCurrentTime(duration))}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <SkipForward size={16} />
        </button>
        <div className="h-4 w-px bg-gray-700 mx-2"></div>
        <select
          value={playbackSpeed}
          onChange={(e) =>
            dispatch(setPlaybackSpeed(parseFloat(e.target.value)))
          }
          className="bg-gray-700 text-xs rounded px-1 py-1 outline-none text-white cursor-pointer"
        >
          <option value="0.5">0.5x</option>
          <option value="1">1.0x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2.0x</option>
        </select>
        <div className="h-4 w-px bg-gray-700 mx-2"></div>
        <span className="text-xs font-mono">
          {currentTime.toFixed(2)}s / {duration}s
        </span>
      </div>

      <div
        className="flex-1 overflow-hidden relative"
        onMouseDownCapture={() => {
          if (isPlaying) dispatch(setIsPlaying(false));
        }}
      >
        {timelineWidth > 0 && (
          <Timeline
            scale={5}
            scaleWidth={160}
            startLeft={20}
            autoScroll={true}
            ref={timelineState}
            editorData={editorData}
            effects={
              {
                videoEffect: {
                  id: "videoEffect",
                  name: "Video",
                },
                imageEffect: {
                  id: "imageEffect",
                  name: "Image",
                },
                textEffect: {
                  id: "textEffect",
                  name: "Text",
                },
              } as Record<string, TimelineEffect>
            }
            getActionRender={(action, _) => {
              const layerName = (action as any).data?.name || "Layer";
              return (
                <div
                  className={`w-full h-full flex items-center px-2 overflow-hidden text-xs rounded border
                                ${
                                  action.effectId === "videoEffect"
                                    ? "bg-blue-900/50 border-blue-700 text-blue-100"
                                    : action.effectId === "imageEffect"
                                    ? "bg-purple-900/50 border-purple-700 text-purple-100"
                                    : "bg-green-900/50 border-green-700 text-green-100"
                                }`}
                >
                  <span className="truncate">{layerName}</span>
                </div>
              );
            }}
            onChange={(_) => {}}
            onCursorDrag={(time: number) => {
              dispatch(setIsPlaying(false));
              dispatch(setCurrentTime(time));
            }}
            onActionResizeEnd={(action) => handleActionMove(action)}
            onActionMoveEnd={(action) => handleActionMove(action)}
            onClickAction={(_e, action) => {
              const id = (action as any).action.id;
              if (id) {
                dispatch(setSelectedLayer(id));
              }
            }}
            rowHeight={40}
            gridSnap={true}
            disableDrag={false}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
    </div>
  );
};
