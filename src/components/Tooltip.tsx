import React, { useState } from 'react';
import { transformText, normalizeText, type StyleType } from '../logic/unicode';

interface TooltipProps {
    onTransform: (newText: string) => void;
    selectedText: string;
}

const Tooltip: React.FC<TooltipProps> = ({ onTransform, selectedText }) => {
    const [isOpen] = useState(true); // Always open when mounted initially

    const handleStyleClick = (style: StyleType) => {
        // 1. Transform the text (transformText now handles normalization internally)
        const transformed = transformText(selectedText, style);

        // 2. Toggle Logic:
        // If the output is identical to input, it implies the text was ALREADY in this style
        // (since transformText(alreadyStyled, style) == alreadyStyled).
        // In this case, the user likely wants to revert to normal text.
        if (transformed === selectedText) {
            onTransform(normalizeText(selectedText));
        } else {
            onTransform(transformed);
        }
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

            <div className="w-px h-6 bg-slate-600 mx-1"></div>

            <button
                onClick={() => handleStyleClick('boldSans')}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-lg w-8 h-8 flex items-center justify-center font-bold"
                title="Bold Sans"
            >
                𝗕
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
                onClick={() => handleStyleClick('smallCaps')}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-sm w-8 h-8 flex items-center justify-center font-bold"
                title="Small Caps"
            >
                ᴄ
            </button>
            <button
                onClick={() => handleStyleClick('squared')}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-sm w-8 h-8 flex items-center justify-center"
                title="Squared"
            >
                🅰
            </button>
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
