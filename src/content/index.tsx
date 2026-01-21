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
    host.style.position = 'fixed'; // CHANGE: Fixed prevents scroll context issues
    host.style.zIndex = '2147483647';
    host.style.top = '0';
    host.style.left = '0';
    host.style.width = '100vw'; // Ensure full coverage
    host.style.height = '100vh';
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
                    if (current instanceof HTMLElement) {
                        const contentEditable = current.getAttribute('contenteditable');
                        if (current.isContentEditable || contentEditable === 'true' || contentEditable === '') {
                            isEditable = true;
                            break;
                        }
                    }
                    current = current.parentNode;
                }

                if (isEditable) {
                    // CHANGE: Use Viewport Coordinates (rect) directly for fixed positioning
                    setSelection({
                        text: sel.toString(),
                        x: rect.left,
                        y: rect.top - 60,
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
        console.log('[FlowText] handleTransform called with:', newText);
        if (!selection) {
            console.warn('[FlowText] No selection state available');
            return;
        }

        const range = selection.range;
        const sel = window.getSelection();
        console.log('[FlowText] Current window selection:', sel?.toString());

        // 1. Identify Target (Text Node)
        let targetNode = range.startContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;

        console.log('[FlowText] Initial TargetNode:', targetNode, 'Type:', targetNode.nodeType);

        // Handle case where selection wraps entire element
        if (targetNode.nodeType !== Node.TEXT_NODE) {
            const walker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_TEXT
            );
            const firstText = walker.nextNode();
            if (firstText) {
                targetNode = firstText;
                startOffset = 0;
                endOffset = firstText.textContent?.length || 0;
                console.log('[FlowText] Found nested text node:', targetNode);
            } else {
                console.error('[FlowText] Could not find text node to replace');
                return;
            }
        }

        // 2. Select the range to replace
        if (sel) {
            console.log('[FlowText] Setting selection range for replacement...');
            sel.removeAllRanges();
            const replaceRange = document.createRange();
            replaceRange.setStart(targetNode, startOffset);

            if (range.endContainer !== targetNode) {
                console.log('[FlowText] Selection spans multiple nodes, clamping to start node.');
                replaceRange.setEnd(targetNode, targetNode.textContent?.length || 0);
            } else {
                replaceRange.setEnd(targetNode, endOffset);
            }

            sel.addRange(replaceRange);
            console.log('[FlowText] Range set. Ready to execCommand.');
        } else {
            console.warn('[FlowText] window.getSelection() returned null');
        }

        // 3. Execute Command
        try {
            console.log('[FlowText] Attempting execCommand("insertText")...');
            const result = document.execCommand('insertText', false, newText);
            console.log('[FlowText] execCommand result:', result);
            if (!result) {
                // Fallback or retry logic could trigger here
                console.warn('[FlowText] execCommand returned false. Document might not be effectively editable or focused.');
                const active = document.activeElement as HTMLElement; // Cast to access isContentEditable
                console.log('[FlowText] Active Element:', active, 'ContentEditable:', active?.isContentEditable);
            }
        } catch (e) {
            console.error('[FlowText] execCommand failed with error:', e);
        }

        console.log('[FlowText] process complete.');
        setSelection(null);
    };

    if (!selection) {
        return null;
    }

    return (
        <div style={{
            pointerEvents: 'auto',
            position: 'fixed', // Fixed for viewport coordinates
            top: selection.y,
            left: selection.x,
            zIndex: 999999
        }}>
            <Tooltip selectedText={selection.text} onTransform={handleTransform} />
        </div>
    );
}

mount();
