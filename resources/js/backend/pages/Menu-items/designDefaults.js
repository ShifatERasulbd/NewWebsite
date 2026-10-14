export const FONT_OPTIONS = [
    { label: 'System UI', value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
    { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
    { label: 'Helvetica / Arial', value: 'Helvetica, Arial, sans-serif' },
    { label: 'Georgia (serif)', value: 'Georgia, "Times New Roman", serif' },
    { label: 'Monospace', value: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
];

export function detectVariant(title) {
    return /footer/i.test(title || '') ? 'footer' : 'header';
}

export function getDefaultDesign(variant = 'header') {
    const isFooter = variant === 'footer';

    return {
        version: 1,
        variant,
        layout: {
            width: 'container',
            maxWidth: 1200,
            height: 72,
            paddingX: 24,
            itemGap: isFooter ? 32 : 28,
            align: 'flex-start',
            logoPosition: 'left',
            sticky: !isFooter,
            shadow: false,
            borderBottom: true,
            borderWidth: 1,
            columns: 4,
        },
        logo: { type: 'text', text: 'AVANT', imageUrl: '', height: 32 },
        colors: {
            background: isFooter ? '#111827' : '#ffffff',
            text: isFooter ? '#d1d5db' : '#111827',
            hover: isFooter ? '#ffffff' : '#2563eb',
            active: isFooter ? '#ffffff' : '#2563eb',
            border: isFooter ? '#1f2937' : '#e5e7eb',
            dropdownBg: '#ffffff',
            dropdownText: '#111827',
            buttonBg: '#111827',
            buttonText: '#ffffff',
        },
        typography: {
            fontFamily: FONT_OPTIONS[0].value,
            fontSize: 15,
            fontWeight: 500,
            uppercase: false,
            letterSpacing: 0,
        },
        dropdown: { radius: 8, width: 220, shadow: true },
        button: { enabled: false, label: 'Contact', url: '/contact', radius: 8 },
        mobile: { breakpoint: 768, burgerPosition: 'right' },
        blocks: [],
        positions: {},
        footer: { copyright: `© ${new Date().getFullYear()} AVANT. All rights reserved.` },
    };
}

// Overlay saved values on defaults; unknown keys are ignored, null/undefined keep the default
export function mergeDesign(defaults, saved) {
    if (!saved || typeof saved !== 'object') return defaults;

    const out = { ...defaults };

    Object.keys(defaults).forEach((key) => {
        const base = defaults[key];
        const value = saved[key];

        if (value === undefined || value === null) return;

        out[key] =
            base && typeof base === 'object' && !Array.isArray(base) && Object.keys(base).length > 0
                ? mergeDesign(base, value)
                : value;
    });

    return out;
}

// Immutable deep set: setIn(obj, 'colors.background', '#fff')
export function setIn(obj, path, value) {
    const [head, ...rest] = path.split('.');

    if (!rest.length) return { ...obj, [head]: value };

    return { ...obj, [head]: setIn(obj[head] || {}, rest.join('.'), value) };
}

// Free-placement offsets saved by drag and drop: { [partId]: { x, y } } in px from the header's top-left
export function getPositions(design) {
    const value = design.positions;

    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

// Default flow layout (used by parts that have not been placed freely yet).
// Parts are 'logo', 'menu', 'cta' and each block id.
export function resolveZones(design) {
    const blocks = design.blocks || [];
    const before = blocks.filter((b) => b.zone === 'before').map((b) => b.id);
    const after = blocks.filter((b) => b.zone !== 'before').map((b) => b.id);
    const logo = design.logo?.type !== 'none' ? ['logo'] : [];
    const cta = design.button?.enabled ? ['cta'] : [];
    const position = design.layout?.logoPosition;

    if (position === 'right') return { left: [...before, 'menu'], center: [], right: [...after, ...cta, ...logo] };
    if (position === 'center') return { left: [...before, 'menu'], center: logo, right: [...after, ...cta] };

    return { left: [...logo, ...before, 'menu'], center: [], right: [...after, ...cta] };
}

// Flat list of part ids in default flow order
export function resolveOrder(design) {
    const zones = resolveZones(design);

    return [...zones.left, ...zones.center, ...zones.right];
}
