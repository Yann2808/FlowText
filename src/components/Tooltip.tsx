import React, { useState } from 'react';
import { transformText, type StyleType } from '../logic/unicode';

interface TooltipProps {
    onTransform: (newText: string) => void;
    selectedText: string;
}

const Tooltip: React.FC<TooltipProps> = ({ onTransform, selectedText }) => {
    const [isOpen] = useState(true); // Always open when mounted initially

    const handleStyleClick = (style: StyleType) => {
        const transformed = transformText(selectedText, style);
        onTransform(transformed);
    };

    if (!isOpen) return null;

    return (
        <div className="flex items-center gap-2 bg-slate-800 text-white p-2 rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in duration-200">
            <button
                onClick={() => handleStyleClick('boldSerif')}
                className="p-2 hover:bg-slate-700 rounded transition-colors font-serif font-bold text-lg w-8 h-8 flex items-center justify-center"
                title="Bold Serif"
            >
                𝐁
            </button>
            <button
                onClick={() => handleStyleClick('italicSerif')}
                className="p-2 hover:bg-slate-700 rounded transition-colors font-serif italic text-lg w-8 h-8 flex items-center justify-center"
                title="Italic Serif"
            >
                𝑖
            </button>
            <button
                onClick={() => handleStyleClick('boldScript')}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-lg w-8 h-8 flex items-center justify-center"
                title="Bold Script"
            >
                𝓑
            </button>

            <div className="w-px h-6 bg-slate-600 mx-1"></div>

            <button
                onClick={() => handleStyleClick('circles')}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-sm w-8 h-8 flex items-center justify-center"
                title="Circles"
            >
                ⓐ
            </button>
        </div>
    );
};

export default Tooltip;
