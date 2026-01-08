import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import type { LayerOptions, LayerType } from '../../types';

interface AddLayerParams {
  type: LayerType;
  options: LayerOptions;
  start: number;
  end: number;
}

interface AddLayerModalsProps {
  activeModal: LayerType | null;
  onClose: () => void;
  onAdd: (params: AddLayerParams) => void;
}

export const AddLayerModals: React.FC<AddLayerModalsProps> = ({ activeModal, onClose, onAdd }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textOpacity, setTextOpacity] = useState(1);
  const [fontSize, setFontSize] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    const options: LayerOptions = {};

    if (activeModal === 'video') {
      options.videoUrl = videoUrl;
      options.volume = 1;
      options.speed = 1;
      options.mute = false;
    } else if (activeModal === 'image') {
      options.imageUrl = imageUrl;
    } else if (activeModal === 'text') {
      options.text = text;
      options.styles = {
        color: textColor,
        opacity: textOpacity,
        fontSize: fontSize,
        rotation: 0,
        border: { color: '#000000', width: 0, style: 'solid' },
        background: { color: '#000000', opacity: 0 },
        shadow: { color: '#000000', opacity: 0, blur: 0, spread: 0, x: 0, y: 0 }
      };
    }

    onAdd({
      type: activeModal,
      options,
      start: Number(startTime),
      end: Number(endTime)
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setVideoUrl('');
    setImageUrl('');
    setText('');
    setStartTime(0);
    setEndTime(5);
    setTextColor('#ffffff');
    setTextOpacity(1);
    setFontSize(30);
  };

  if (!activeModal) return null;

  return (
    <Modal
      isOpen={!!activeModal}
      onClose={() => { onClose(); resetForm(); }}
      title={`Add ${activeModal.charAt(0).toUpperCase() + activeModal.slice(1)} Layer`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        
        {activeModal === 'video' && (
          <div>
            <label className="block text-gray-400 mb-1">Video URL</label>
            <input 
              required
              type="url" 
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/video.mp4"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
            />
          </div>
        )}

        {activeModal === 'image' && (
          <div>
            <label className="block text-gray-400 mb-1">Image URL</label>
            <input 
              required
              type="url" 
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>
        )}

        {activeModal === 'text' && (
          <>
            <div>
              <label className="block text-gray-400 mb-1">Text Content</label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Hello World"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-400 mb-1">Color</label>
                    <input 
                        type="color" 
                        className="w-full h-9 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                        value={textColor}
                        onChange={e => setTextColor(e.target.value)}
                    />
                </div>
                <div>
                     <label className="block text-gray-400 mb-1">Opacity</label>
                    <input 
                        type="number" 
                        min="0" max="1" step="0.1"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        value={textOpacity}
                        onChange={e => setTextOpacity(parseFloat(e.target.value))}
                    />
                </div>
                <div>
                     <label className="block text-gray-400 mb-1">Font Size (px)</label>
                    <input 
                        type="number" 
                        min="10" max="200"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        value={fontSize}
                        onChange={e => setFontSize(parseFloat(e.target.value))}
                    />
                </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-1">Start Time (s)</label>
            <input 
              required
              type="number" 
              min="0"
              step="0.1"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              value={startTime}
              onChange={e => setStartTime(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">End Time (s)</label>
            <input 
              required
              type="number" 
              min="0"
              step="0.1"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              value={endTime}
              onChange={e => setEndTime(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button 
            type="button"
            onClick={() => { onClose(); resetForm(); }}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Add Layer
          </button>
        </div>
      </form>
    </Modal>
  );
};
