import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { setStageSize } from '../../store/editorSlice';
import type { AspectRatio } from '../../types';

export const StageSizeControl: React.FC = () => {
    const dispatch = useAppDispatch();
    const { stage } = useAppSelector(state => state.editor);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setStageSize(e.target.value as AspectRatio));
    };

    return (
        <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Ratio:</label>
            <select 
                value={stage.aspectRatio} 
                onChange={handleChange}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 outline-none border border-gray-600 focus:border-purple-500"
            >
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
                <option value="4:5">4:5</option>
            </select>
        </div>
    );
};
