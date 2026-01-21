import React, { useState } from 'react';
import { transformText, normalizeText, type StyleType } from '../logic/unicode';

interface TooltipProps {
    onTransform: (newText: string) => void;
    selectedText: string;
}

const Tooltip: React.FC<TooltipProps> = ({ onTransform, selectedText }) => {
    const [isOpen] = useState(true);

    // Check which style is active
    // If transforming the already selected text results in the exact same string,
    // it implies the text is already in that style.
    const isStyleActive = (style: StyleType) => {
        return selectedText && transformText(selectedText, style) === selectedText;
    };

    const handleStyleClick = (style: StyleType) => {
        const isActive = isStyleActive(style);

        if (isActive) {
            // Toggle off: revert to normal
            onTransform(normalizeText(selectedText));
        } else {
            // Apply style
            onTransform(transformText(selectedText, style));
        }
    };

    const Button = ({ style, icon, title, isTextIcon = false }: { style: StyleType, icon: string, title: string, isTextIcon?: boolean }) => {
        const active = isStyleActive(style);
        return (
            <button
                onMouseDown={(e) => e.preventDefault()} // Critical: Prevents focus loss from the text editor
                onClick={() => handleStyleClick(style)}
                className={`
          flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200
          ${active
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
          ${isTextIcon ? 'text-xs font-bold tracking-widest' : 'text-xl'}
        `}
                title={title}
            >
                {icon}
            </button>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="flex items-center gap-1.5 bg-slate-900 text-white p-2 rounded-xl shadow-2xl border border-slate-700/50 animate-in fade-in zoom-in duration-200 backdrop-blur-sm">

            {/* Group 1: Standard Formatting */}
            <div className="flex items-center gap-1">
                <Button style="boldSans" icon="𝗕" title="Bold Sans" />
                <Button style="boldSerif" icon="𝐁" title="Bold Serif" />
                <Button style="italicSerif" icon="𝑖" title="Italic Serif" />
            </div>

            <div className="w-px h-6 bg-slate-700 mx-1 opacity-50"></div>

            {/* Group 2: Special Styles */}
            <div className="flex items-center gap-1">
                <Button style="smallCaps" icon="ᴀʙ" title="Small Caps" isTextIcon />
                <Button style="boldScript" icon="𝒮" title="Script" />
                <Button style="squared" icon="🅰" title="Squared" />
                <Button style="circles" icon="Ⓐ" title="Circles" />
            </div>

            <div className="w-px h-6 bg-slate-700 mx-1 opacity-50"></div>

            {/* Group 3: More (Placeholder for now) */}
            <button
                onMouseDown={(e) => e.preventDefault()}
                className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
            >
                <span className="mb-2 text-xl leading-none">...</span>
            </button>

        </div>
    );
};

export default Tooltip;
