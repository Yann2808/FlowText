import React, { useState } from 'react';
import { transformText, normalizeText, type StyleType } from '../logic/unicode';

interface TooltipProps {
    onTransform: (newText: string) => void;
    selectedText: string;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const Tooltip: React.FC<TooltipProps> = ({ onTransform, selectedText }) => {
    const [isOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    // Check which style is active
    const isStyleActive = (style: StyleType) => {
        return selectedText && transformText(selectedText, style) === selectedText;
    };

    const handleStyleClick = (style: StyleType) => {
        const isActive = isStyleActive(style);

        if (isActive) {
            onTransform(normalizeText(selectedText));
        } else {
            onTransform(transformText(selectedText, style));
        }
    };

    const Button = ({ style, icon, title, isTextIcon = false }: { style: StyleType, icon: string, title: string, isTextIcon?: boolean }) => {
        const active = isStyleActive(style);
        return (
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleStyleClick(style);
                }}
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

    if (!isExpanded) {
        return (
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    setIsExpanded(true);
                }}
                className="flex items-center justify-center w-12 h-12 bg-slate-900 text-indigo-400 rounded-full shadow-xl border border-slate-700/50 hover:bg-slate-800 hover:scale-110 hover:text-indigo-300 transition-all duration-200 animate-in fade-in zoom-in cursor-pointer"
                title="Open FlowText"
            >
                <SparklesIcon />
            </button>
        );
    }

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

            {/* Actions */}
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    setIsExpanded(false);
                }}
                className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                title="Close"
            >
                <XIcon />
            </button>

        </div>
    );
};

export default Tooltip;
