import React from 'react';
import { createRoot } from 'react-dom/client';
import Tooltip from '../components/Tooltip';
// @ts-ignore
import styles from '../index.css?inline';

const CONTAINER_ID = 'flowtext-extension-root';

const mount = () => {
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

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    shadow.appendChild(styleSheet);

    const root = createRoot(shadow);
    root.render(<RenderLoop />);
};

const RenderLoop = () => {
    const [selection, setSelection] = React.useState<{ text: string, x: number, y: number, range: Range } | null>(null);

    React.useEffect(() => {
        const handleMouseUp = () => {
            const sel = window.getSelection();
            if (sel && sel.toString().length > 0) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                let node = range.commonAncestorContainer;
                let isEditable = false;
                let current: Node | null = node;
                while (current) {
                    if (current instanceof HTMLElement && (current.isContentEditable || current.getAttribute('contenteditable') !== null)) {
                        isEditable = true;
                        break;
                    }
                    current = current.parentNode;
                }

                if (isEditable) {
                    setSelection({
                        text: sel.toString(),
                        x: rect.left + window.scrollX,
                        y: rect.top + window.scrollY - 60,
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
                setTimeout(handleMouseUp, 100);
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

        const range = selection.range;
        const sel = window.getSelection();

        // 1. Identify Target (Text Node)
        // We act directly on the node where selection started.
        // Usually, for styled text, it's a TextNode.
        let targetNode = range.startContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;

        // Handle case where selection wraps entire element
        if (targetNode.nodeType !== Node.TEXT_NODE) {
            // Try to find the first text node in the selection
            const walker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_TEXT
            );
            const firstText = walker.nextNode();
            if (firstText) {
                targetNode = firstText;
                startOffset = 0;
                endOffset = firstText.textContent?.length || 0;
            } else {
                console.error('[FlowText] Could not find text node to replace');
                return;
            }
        }

        const originalText = targetNode.textContent || '';

        // 2. String Reconstruction
        // [Before] + [New] + [After]
        const before = originalText.substring(0, startOffset);
        // Note: For multi-node selection, this logic simplistic (it replaces only the start node part). 
        // But for typical single-word/phrase selection, endOffset is usually on the same node or we assume full replacement if nodes differ.
        // To be safe for the user's "Critical Fix" request, we follow the "Specific #text node" instruction.
        // If the selection spans multiple nodes, standard range.deleteContents() is safer but user requested direct text manipulation.
        // Let's stick to the user's specific text slicing strategy which works best for single-node text.

        // Adjust endOffset if it's in a different node (simplification: assume single node selection for stability or clamp)
        if (range.endContainer !== targetNode) {
            // Complex selection: Fallback to deleteContents + insert?
            // User explicitly asked for "Identify the specific #text node".
            // We will assume the selection is primarily contained or starts in this node.
            // Let's reconstruct as safely as possible.
            endOffset = originalText.length; // Truncate to end of this node if selection spans further
        }

        const after = originalText.substring(endOffset);
        const reconstructedContent = before + newText + after;

        // 3. Direct Update
        targetNode.textContent = reconstructedContent;

        // 4. Cursor Restoration & Focus
        const editable = (targetNode.parentElement as HTMLElement)?.closest('[contenteditable]') as HTMLElement;
        if (editable) editable.focus();

        if (sel) {
            sel.removeAllRanges();
            const newRange = document.createRange();
            // Position after the inserted text
            const newCursorPos = before.length + newText.length;
            newRange.setStart(targetNode, newCursorPos);
            newRange.setEnd(targetNode, newCursorPos);
            sel.addRange(newRange);
        }

        // 5. THE KEY STEP: Force React/Ember Update
        if (editable) {
            // Dispatch 'input' event - Native, Bubbling, Composed
            // This is arguably the most important event for modern frameworks.
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: newText,
                isComposing: false
            });
            editable.dispatchEvent(inputEvent);
        }

        console.log('[FlowText] Direct TextNode update complete.');
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
