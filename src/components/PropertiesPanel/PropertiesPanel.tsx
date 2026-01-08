/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { updateLayer, removeLayer, setSelectedLayer } from '../../store/editorSlice';

export const PropertiesPanel: React.FC = () => {
    const dispatch = useAppDispatch();
    const { selectedLayerId, layers } = useAppSelector(state => state.editor);
    const layer = layers.find(l => l.id === selectedLayerId);

    if (!layer) {
        return (
            <div className="flex-1 p-4 flex items-center justify-center text-gray-500 text-sm">
                Select a layer to edit properties
            </div>
        );
    }

    const handleChange = (path: string, value: any) => {        
        let changes: any = {};
        if (path.includes('.')) {
            const [parent, child] = path.split('.');
            changes[parent] = { ...(layer as any)[parent], [child]: value };
        } else {
            changes[path] = value;
        }

        dispatch(updateLayer({
            id: layer.id,
            changes
        }));
    };

    const handleOptionChange = (key: string, value: any) => {
        dispatch(updateLayer({
            id: layer.id,
            changes: {
                options: {
                    ...layer.options,
                    [key]: value
                }
            }
        }));
    };

    const handleStyleChange = (key: string, value: any) => {
        dispatch(updateLayer({
            id: layer.id,
            changes: {
                options: {
                    ...layer.options,
                    styles: {
                        ...layer.options.styles,
                        [key]: value
                    }
                }
            }
        }));
    };
    
    const handleGeometryChange = (key: string, value: any) => {
        dispatch(updateLayer({
            id: layer.id,
            changes: {
                geometry: {
                    ...layer.geometry,
                    [key]: parseFloat(value)
                }
            }
        }));
    };

    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Layer Info</h3>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">Name</label>
                    <input 
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        value={layer.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Geometry (Relative 0-1)</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-gray-500 block">X</label>
                        <input 
                            type="number" step="0.01"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            value={layer.geometry.x}
                            onChange={(e) => handleGeometryChange('x', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block">Y</label>
                        <input 
                            type="number" step="0.01"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            value={layer.geometry.y}
                            onChange={(e) => handleGeometryChange('y', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block">Width</label>
                        <input 
                            type="number" step="0.01"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            value={layer.geometry.width}
                            onChange={(e) => handleGeometryChange('width', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block">Height</label>
                        <input 
                            type="number" step="0.01"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            value={layer.geometry.height}
                            onChange={(e) => handleGeometryChange('height', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Properties</h3>
                
                {layer.type === 'video' && (
                    <div className="space-y-2">
                         <label className="flex items-center space-x-2">
                            <input 
                                type="checkbox"
                                checked={layer.options.mute || false}
                                onChange={(e) => handleOptionChange('mute', e.target.checked)}
                            />
                            <span className="text-sm text-gray-400">Mute</span>
                         </label>
                         <div>
                            <label className="text-xs text-gray-500 block">Volume</label>
                            <input 
                                type="range" min="0" max="1" step="0.1"
                                className="w-full"
                                value={layer.options.volume ?? 1}
                                onChange={(e) => handleOptionChange('volume', parseFloat(e.target.value))}
                            />
                         </div>
                    </div>
                )}
                
                {layer.type === 'text' && (
                    <div className="space-y-2">
                         <div>
                            <label className="text-xs text-gray-500 block">Content</label>
                            <textarea
                                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                                value={layer.options.text}
                                onChange={(e) => handleOptionChange('text', e.target.value)}
                            />
                         </div>
                         <div>
                            <label className="text-xs text-gray-500 block">Color</label>
                            <input 
                                type="color"
                                className="w-full bg-gray-800 h-8"
                                value={layer.options.styles?.color || '#ffffff'}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                            />
                         </div>
                         <div>
                            <label className="text-xs text-gray-500 block">Opacity</label>
                            <input 
                                type="range" min="0" max="1" step="0.1"
                                className="w-full"
                                value={layer.options.styles?.opacity ?? 1}
                                onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                            />
                         </div>
                    </div>
                )}
            </div>
            <div className="pt-4 border-t border-gray-800">
                <button 
                    onClick={() => {
                        dispatch(removeLayer(layer.id));
                        dispatch(setSelectedLayer(null));
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded transition-colors"
                >
                    Delete Layer
                </button>
            </div>
        </div>
    );
};
