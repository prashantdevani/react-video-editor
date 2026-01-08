import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '../../hooks/store';

export const Loader: React.FC = () => {
    const { isLoading } = useAppSelector(state => state.editor);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-white">Loading Project...</h2>
            <p className="text-gray-400 text-sm mt-2">Preparing your assets</p>
        </div>
    );
};
