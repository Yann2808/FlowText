import { transformText, normalizeText } from './unicode';

const testLogic = () => {
    const original = "Hello World";

    console.log('--- TEST START ---');
    console.log('Original:', original);

    // 1. To Bold
    const bold = transformText(original, 'boldSerif');
    console.log('Bold:', bold);

    // 2. Normalize Bold (Should be "Hello World")
    const normalizedBold = normalizeText(bold);
    console.log('Normalized Bold:', normalizedBold);
    console.log('Is Normalized Correct?', normalizedBold === original);

    // 3. Bold to Italic
    const italicFromBold = transformText(bold, 'italicSerif');
    console.log('Bold -> Italic:', italicFromBold);

    // 4. Check expected Italic
    const italicDirect = transformText(original, 'italicSerif');
    console.log('Italic Direct:', italicDirect);

    console.log('Is Swap Correct?', italicFromBold === italicDirect);

    // 5. Test Toggle Logic (Bold -> Bold should be Normal)
    // Simulating Tooltip logic
    if (transformText(bold, 'boldSerif') === bold) {
        console.log('Toggle Logic Check: Detected same style. Reverting.');
        console.log('Revert Result:', normalizeText(bold));
    } else {
        console.log('Toggle Logic Failed: Did not detect same style.');
        console.log('Transform result:', transformText(bold, 'boldSerif'));
    }

    // 6. New Styles Tests
    const newStyles = ['boldScript', 'circles', 'boldSans', 'smallCaps', 'squared'] as const;
    console.log('--- NEW STYLES TESTS ---');

    newStyles.forEach(style => {
        const transformed = transformText(original, style);
        const normalized = normalizeText(transformed);

        let isValid = normalized === original;
        // SmallCaps and Squared are lossy (map to uppercase-like glyphs only)
        if (style === 'smallCaps' || style === 'squared') {
            isValid = normalized.toUpperCase() === original.toUpperCase();
        }

        console.log(`Style: ${style}`);
        console.log(`  Output: ${transformed}`);
        console.log(`  Normalized: ${normalized}`);
        console.log(`  Valid: ${isValid}`);
    });

    console.log('--- TEST END ---');
};

testLogic();
