import React, { useState } from "react";
import { store } from "./store";
import { Stage } from "./components/Stage/Stage";
import { TimelineEditor } from "./components/Timeline/Timeline";
import { PropertiesPanel } from "./components/PropertiesPanel/PropertiesPanel";
import { AddLayerModals } from "./components/Modals/AddLayerModals";
import { StageSizeControl } from "./components/Header/StageSizeControl";
import { Loader } from "./components/Loader/Loader";
import { useAppDispatch, useAppSelector } from "./hooks/store";
import { addLayer, setLoading, loadState } from "./store/editorSlice";
import { v4 as uuidv4 } from "uuid";
import type { LayerType, LayerOptions, EditorState } from "./types";

function App() {
  const dispatch = useAppDispatch();
  const { layers } = useAppSelector((state) => state.editor);
  const [activeModal, setActiveModal] = useState<LayerType | null>(null);

  const calculateSafePosition = (width: number, height: number) => {
    let x = 0.1;
    let y = 0.1;
    const step = 0.05;

    for (let i = 0; i < 10; i++) {
      const hasOverlap = layers.some(
        (l) =>
          Math.abs(l.geometry.x - x) < 0.01 && Math.abs(l.geometry.y - y) < 0.01
      );
      if (!hasOverlap) break;
      x += step;
      y += step;
      if (x + width > 1) x = 0.1;
      if (y + height > 1) y = 0.1;
    }
    return { x, y };
  };

  const handleAddLayer = (params: {
    type: LayerType;
    options: LayerOptions;
    start: number;
    end: number;
  }) => {
    let width = 0.3;
    let height = 0.3;
    if (params.type === "text") {
      width = 0.4;
      height = 0.15;
    }

    const { x, y } = calculateSafePosition(width, height);

    const maxZ =
      layers.length > 0 ? Math.max(...layers.map((l) => l.zIndex)) : 0;

    dispatch(
      addLayer({
        id: uuidv4(),
        type: params.type,
        name:
          params.type === "image"
            ? "Image Layer"
            : params.type === "video"
            ? "Video Layer"
            : params.options.text || "Text Layer",
        zIndex: maxZ + 1,
        timeline: { start: params.start, end: params.end },
        geometry: { x, y, width, height },
        options: params.options,
      })
    );
  };

  const handleExport = () => {
    const state = store.getState().editor;
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-editor-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const preloadAssets = async (state: EditorState) => {
    const promises: Promise<void>[] = [];

    state.layers.forEach((layer) => {
      if (layer.type === "image" && layer.options.imageUrl) {
        promises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.src = layer.options.imageUrl!;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
        );
      } else if (layer.type === "video" && layer.options.videoUrl) {
        promises.push(
          new Promise((resolve) => {
            const video = document.createElement("video");
            video.src = layer.options.videoUrl!;
            video.onloadedmetadata = () => resolve();
            video.onerror = () => resolve();
          })
        );
      }
    });

    return Promise.all(promises);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    dispatch(setLoading(true));

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = event.target?.result as string;
        const state = JSON.parse(json) as EditorState;
        if (!state.layers || !state.stage) {
          throw new Error("Invalid project file");
        }

        await preloadAssets(state);

        dispatch(loadState(state));

        console.log("Assets Loaded. State Hydrated.");
      } catch (err) {
        console.error("Invalid JSON", err);
        alert("Failed to load project");
      } finally {
        dispatch(setLoading(false));
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const GITHUB_URL = window?._env_?.GITHUB_URL;
  const GITHUB_BUTTON_LABLE =
    window?._env_?.GITHUB_BUTTON_LABLE ?? "Github CodeBase";

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <Loader />
      <header className="h-14 border-b border-gray-800 flex items-center px-4 bg-gray-950">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          React Video Editor
        </h1>
        <div className="ml-8 hidden md:block">
          <StageSizeControl />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {GITHUB_URL && (
            <label className="bg-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-700 hidden sm:block">
              <a target="_blank" href={GITHUB_URL}>
                {GITHUB_BUTTON_LABLE}
              </a>
            </label>
          )}
          <label className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors cursor-pointer text-nowrap">
            Import JSON
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleImport}
            />
          </label>
          <button
            onClick={handleExport}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors text-nowrap"
          >
            Export JSON
          </button>
        </div>
      </header>
      <div className="md:hidden p-2 flex justify-center bg-gray-950 border-b border-gray-800">
        <StageSizeControl />
      </div>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-72 border-r border-gray-800 flex flex-col bg-gray-900 h-1/3 md:h-auto overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-gray-400">Assets</h2>
          </div>
          <div className="flex-1 p-4 flex flex-col space-y-2">
            <button
              onClick={() => setActiveModal("video")}
              className="bg-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-700"
            >
              Add Video Layer
            </button>
            <button
              onClick={() => setActiveModal("image")}
              className="bg-purple-600 px-3 py-2 rounded text-sm hover:bg-purple-700"
            >
              Add Image Layer
            </button>
            <button
              onClick={() => setActiveModal("text")}
              className="bg-green-600 px-3 py-2 rounded text-sm hover:bg-green-700"
            >
              Add Text Layer
            </button>
            <p className="text-gray-500 text-xs mt-4">
              Click to configure new layers
            </p>
          </div>
        </div>

        <div className="flex-1 bg-gray-800 flex items-center justify-center relative overflow-hidden p-4 min-h-[300px]">
          <Stage />
        </div>

        <div className="w-full md:w-72 border-l border-gray-800 flex flex-col bg-gray-900 h-1/3 md:h-auto overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-gray-400">Properties</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <PropertiesPanel />
          </div>
        </div>
      </main>

      <div className="h-48 md:h-80 border-t border-gray-800 bg-gray-950 flex flex-col">
        <div className="p-2 border-b border-gray-800 flex justify-between items-center bg-gray-900">
          <span className="text-xs text-gray-400">Timeline Controls</span>
        </div>
        <div className="flex-1 relative">
          <TimelineEditor />
        </div>
      </div>

      <AddLayerModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddLayer}
      />
    </div>
  );
}

export default App;
