import React from 'react';
import { createRoot } from 'react-dom/client';
import Tooltip from '../components/Tooltip';
// @ts-ignore
import styles from '../index.css?inline';

const CONTAINER_ID = 'flowtext-extension-root';

const mount = () => {
    // Check if exists
    if (document.getElementById(CONTAINER_ID)) return;

    const host = document.createElement('div');
    host.id = CONTAINER_ID;
    host.style.position = 'absolute';
    host.style.zIndex = '2147483647';
    host.style.top = '0';
    host.style.left = '0';
    host.style.pointerEvents = 'none';

    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // Inject Tailwind Styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    shadow.appendChild(styleSheet);

    const root = createRoot(shadow);

    // Mount the RenderLoop
    root.render(<RenderLoop />);
};

const RenderLoop = () => {
    // Simple wrapper to handle state
    const [selection, setSelection] = React.useState<{ text: string, x: number, y: number, range: Range } | null>(null);

    React.useEffect(() => {
        const handleMouseUp = () => {
            const sel = window.getSelection();
            if (sel && sel.toString().length > 0) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Debug logs
                console.log('[FlowText] Selection detected:', sel.toString());

                // Important: Verify we are in a contenteditable or input
                let node = range.commonAncestorContainer;
                // traverse up to find contenteditable
                let isEditable = false;
                let current: Node | null = node;
                while (current) {
                    if (current instanceof HTMLElement && (current.isContentEditable || current.getAttribute('contenteditable') === 'true')) {
                        isEditable = true;
                        break;
                    }
                    current = current.parentNode;
                }

                console.log('[FlowText] Is Editable?', isEditable);

                // RELAXED CHECK FOR DEBUG: Show on any selection if specific check fails, or just log.
                // For now, let's keep it strict but log.
                if (isEditable) {
                    setSelection({
                        text: sel.toString(),
                        x: rect.left + window.scrollX,
                        y: rect.top + window.scrollY - 60, // Above selection
                        range: range.cloneRange()
                    });
                } else {
                    setSelection(null);
                }

            } else {
                setSelection(null);
            }
        };

        const handleSelectionChange = () => {
            const sel = window.getSelection();
            if (!sel || sel.toString().length === 0) {
                setSelection(null);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key.startsWith('Arrow')) {
                setTimeout(handleMouseUp, 100); // Small delay to let selection update
            }
        }

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    const handleTransform = (newText: string) => {
        if (!selection) return;

        // Replace text
        const range = selection.range;
        range.deleteContents();
        const textNode = document.createTextNode(newText);
        range.insertNode(textNode);

        // Dispatch events to notify LinkedIn editor (React/Draft.js)
        const target = range.commonAncestorContainer.parentElement || range.commonAncestorContainer;
        if (target instanceof HTMLElement) {
            target.dispatchEvent(new Event('input', { bubbles: true }));
            // legacy
            target.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Move cursor to end of inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }

        setSelection(null);
    };

    if (!selection) return null;

    return (
        <div style={{ pointerEvents: 'auto', position: 'absolute', top: selection.y, left: selection.x }}>
            <Tooltip selectedText={selection.text} onTransform={handleTransform} />
        </div>
    );
}

mount();
