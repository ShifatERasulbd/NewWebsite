import { Menu as MenuIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { getPositions, resolveOrder, resolveZones } from '@/backend/pages/Menu-items/designDefaults';
import { flattenItems } from '@/backend/pages/Menu-items/utils';

function textStyle(design, color) {
  const { typography } = design;

  return {
    color,
    fontFamily: typography.fontFamily,
    fontSize: `${typography.fontSize}px`,
    fontWeight: typography.fontWeight,
    textTransform: typography.uppercase ? 'uppercase' : 'none',
    letterSpacing: `${typography.letterSpacing}px`,
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
  };
}

function Logo({ design }) {
  const { logo, colors, typography } = design;

  if (logo.type === 'none') return null;

  if (logo.type === 'image') {
    return logo.imageUrl ? (
      <img src={logo.imageUrl} alt="" style={{ height: logo.height }} />
    ) : (
      <span style={{ color: colors.text, opacity: 0.5, fontSize: 12 }}>Logo image</span>
    );
  }

  return (
    <span
      style={{
        color: colors.text,
        fontFamily: typography.fontFamily,
        fontWeight: 700,
        fontSize: Math.round(logo.height * 0.7),
        whiteSpace: 'nowrap',
      }}
    >
      {logo.text}
    </span>
  );
}

function NavItem({ item, design, depth = 0, active = false }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const { colors, dropdown } = design;
  const children = item.children || [];
  const isTop = depth === 0;

  const color = hover
    ? colors.hover
    : isTop
      ? active
        ? colors.active
        : colors.text
      : colors.dropdownText;

  return (
    <li
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        position: 'relative',
        listStyle: 'none',
        display: 'flex',
        alignItems: isTop ? 'center' : 'stretch',
        opacity: item.status === 'published' ? 1 : 0.5,
      }}
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...textStyle(design, color),
          display: 'block',
          width: isTop ? 'auto' : '100%',
          padding: isTop ? 0 : '8px 16px',
        }}
      >
        {item.title}
        {children.length > 0 && (isTop ? ' ▾' : ' ▸')}
      </a>

      {children.length > 0 && open && (
        <ul
          style={{
            position: 'absolute',
            top: isTop ? '100%' : 0,
            left: isTop ? 0 : '100%',
            minWidth: dropdown.width,
            margin: 0,
            padding: '6px 0',
            background: colors.dropdownBg,
            border: `1px solid ${colors.border}`,
            borderRadius: dropdown.radius,
            boxShadow: dropdown.shadow ? '0 10px 30px rgba(0, 0, 0, 0.15)' : 'none',
            zIndex: 20 + depth,
          }}
        >
          {children.map((child) => (
            <NavItem key={child.id} item={child} design={design} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

const SOCIAL_BADGES = [
  ['facebook', 'f'],
  ['instagram', 'ig'],
  ['x', 'X'],
  ['linkedin', 'in'],
  ['youtube', '▶'],
];

function Block({ block, design }) {
  const { colors, button, typography } = design;
  const stop = (e) => e.preventDefault();

  if (block.type === 'text') {
    return <span style={{ ...textStyle(design, colors.text), cursor: 'default' }}>{block.text}</span>;
  }

  if (block.type === 'phone') {
    return (
      <a href="#" onClick={stop} style={textStyle(design, colors.text)}>
        {block.text || 'Phone number'}
      </a>
    );
  }

  if (block.type === 'search') {
    return (
      <input
        type="text"
        readOnly
        placeholder={block.text || 'Search...'}
        style={{
          height: 34,
          padding: '0 12px',
          width: 160,
          background: 'transparent',
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          fontFamily: typography.fontFamily,
          fontSize: Math.max(typography.fontSize - 1, 10),
        }}
      />
    );
  }

  if (block.type === 'social') {
    const active = SOCIAL_BADGES.filter(([key]) => block[key]);
    const shown = active.length ? active : SOCIAL_BADGES.slice(0, 3);

    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: active.length ? 1 : 0.4 }}>
        {shown.map(([key, label]) => (
          <a
            key={key}
            href="#"
            onClick={stop}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontFamily: typography.fontFamily,
              fontSize: 11,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {label}
          </a>
        ))}
      </div>
    );
  }

  if (block.type === 'button') {
    const outline = block.variant === 'outline';

    return (
      <a
        href="#"
        onClick={stop}
        style={{
          ...textStyle(design, outline ? colors.buttonBg : colors.buttonText),
          background: outline ? 'transparent' : colors.buttonBg,
          border: `1px solid ${colors.buttonBg}`,
          borderRadius: button.radius,
          padding: '7px 16px',
        }}
      >
        {block.text || 'Button'}
      </a>
    );
  }

  return null;
}

function BlockGroup({ blocks, design, direction = 'row' }) {
  if (!blocks.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: direction, alignItems: direction === 'row' ? 'center' : 'flex-start', gap: 16 }}>
      {blocks.map((block) => (
        <Block key={block.id} block={block} design={design} />
      ))}
    </div>
  );
}

function MobileList({ design, items }) {
  const { colors, layout } = design;
  const blocks = resolveOrder(design)
    .map((id) => (design.blocks || []).find((b) => b.id === id))
    .filter(Boolean);

  return (
    <div style={{ background: colors.background, borderTop: `1px solid ${colors.border}` }}>
    <ul style={{ margin: 0, padding: '8px 0' }}>
      {flattenItems(items).map((item, index) => (
        <li
          key={item.id}
          style={{
            listStyle: 'none',
            padding: `8px ${layout.paddingX}px 8px ${layout.paddingX + item.depth * 16}px`,
            opacity: item.status === 'published' ? 1 : 0.5,
          }}
        >
          <span style={textStyle(design, index === 0 ? colors.active : colors.text)}>
            {item.depth > 0 ? '↳ ' : ''}
            {item.title}
          </span>
        </li>
      ))}
    </ul>
    {blocks.length > 0 && (
      <div style={{ padding: `8px ${layout.paddingX}px 16px` }}>
        <BlockGroup blocks={blocks} design={design} direction="column" />
      </div>
    )}
    </div>
  );
}

function FreePart({ id, pos, edit, style, children }) {
  const placed = pos ? { position: 'absolute', left: pos.x, top: pos.y, zIndex: 10 } : {};

  if (!edit) return <div style={{ ...style, ...placed }}>{children}</div>;

  const selected = edit.selectedId === id;

  return (
    <div
      data-part={id}
      tabIndex={0}
      title="Drag anywhere. Arrow keys nudge 1px (Shift: 10px). Double-click to return to the normal flow."
      onPointerDown={(e) => edit.begin(e, id)}
      onPointerMove={edit.move}
      onPointerUp={edit.end}
      onPointerCancel={edit.end}
      onKeyDown={(e) => edit.key(e, id)}
      onDoubleClick={() => edit.reset(id)}
      onFocus={() => edit.select(id)}
      onDragStart={(e) => e.preventDefault()}
      style={{
        ...style,
        ...placed,
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        borderRadius: 4,
        outline: selected ? '2px solid #2563eb' : '1px dashed rgba(37, 99, 235, 0.35)',
        outlineOffset: 4,
      }}
    >
      {children}
    </div>
  );
}

function HeaderPreview({ design, items, mobile, onMovePart, onResetPart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const innerRef = useRef(null);
  const dragRef = useRef(null);
  const { layout, colors, button, mobile: mobileSettings } = design;

  const bar = {
    position: 'relative',
    zIndex: 30,
    background: colors.background,
    borderBottom: layout.borderBottom ? `${layout.borderWidth}px solid ${colors.border}` : 'none',
    boxShadow: layout.shadow ? '0 2px 12px rgba(0, 0, 0, 0.08)' : 'none',
  };

  const inner = {
    maxWidth: layout.width === 'container' ? layout.maxWidth : '100%',
    margin: '0 auto',
    height: layout.height,
    padding: `0 ${layout.paddingX}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: layout.align,
    gap: 24,
  };

  if (mobile) {
    const burger = (
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((value) => !value)}
        style={{ background: 'none', border: 'none', color: colors.text, cursor: 'pointer', display: 'flex' }}
      >
        {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>
    );

    return (
      <div style={bar}>
        <div style={{ ...inner, justifyContent: 'space-between' }}>
          {mobileSettings.burgerPosition === 'left' ? (
            <>
              {burger}
              <Logo design={design} />
            </>
          ) : (
            <>
              <Logo design={design} />
              {burger}
            </>
          )}
        </div>
        {menuOpen && <MobileList design={design} items={items} />}
      </div>
    );
  }

  const nav = (
    <ul
      style={{
        display: 'flex',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        gap: layout.itemGap,
        flex: '0 1 auto',
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((item, index) => (
        <NavItem key={item.id} item={item} design={design} active={index === 0} />
      ))}
    </ul>
  );

  const cta = button.enabled ? (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{
        ...textStyle(design, colors.buttonText),
        background: colors.buttonBg,
        borderRadius: button.radius,
        padding: '8px 18px',
      }}
    >
      {button.label || 'Button'}
    </a>
  ) : null;

  const blocks = design.blocks || [];
  const zones = resolveZones(design);
  const positions = getPositions(design);
  const editing = Boolean(onMovePart);

  // Current offset of a part from the header's top-left corner
  const measure = (el) => {
    const container = innerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    return { x: Math.round(rect.left - container.left), y: Math.round(rect.top - container.top) };
  };

  const edit = editing
    ? {
        selectedId,
        select: setSelectedId,
        reset: (id) => onResetPart && onResetPart(id),
        begin: (e, id) => {
          if (e.button !== 0 || !innerRef.current) return;
          dragRef.current = {
            id,
            startX: e.clientX,
            startY: e.clientY,
            origin: positions[id] || measure(e.currentTarget),
          };
          setSelectedId(id);
          if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
        },
        move: (e) => {
          const drag = dragRef.current;
          if (!drag) return;
          const dx = e.clientX - drag.startX;
          const dy = e.clientY - drag.startY;
          if (dx === 0 && dy === 0) return;
          onMovePart(drag.id, { x: Math.round(drag.origin.x + dx), y: Math.round(drag.origin.y + dy) });
        },
        end: (e) => {
          dragRef.current = null;
          if (e.currentTarget.releasePointerCapture && e.currentTarget.hasPointerCapture?.(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        },
        key: (e, id) => {
          const step = e.shiftKey ? 10 : 1;
          const delta = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, -step],
            ArrowDown: [0, step],
          }[e.key];
          if (!delta || !innerRef.current) return;
          e.preventDefault();
          const origin = positions[id] || measure(e.currentTarget);
          onMovePart(id, { x: origin.x + delta[0], y: origin.y + delta[1] });
        },
      }
    : null;

  const centered = { display: 'flex', alignItems: 'center' };

  const renderPart = (id) => {
    if (id === 'logo') {
      return (
        <FreePart key={id} id={id} pos={positions[id]} edit={edit} style={centered}>
          <Logo design={design} />
        </FreePart>
      );
    }

    if (id === 'menu') {
      return (
        <FreePart
          key={id}
          id={id}
          pos={positions[id]}
          edit={edit}
          style={{ display: 'flex', alignSelf: 'stretch', minWidth: 0 }}
        >
          {nav}
        </FreePart>
      );
    }

    if (id === 'cta') {
      return (
        <FreePart key={id} id={id} pos={positions[id]} edit={edit} style={centered}>
          {cta}
        </FreePart>
      );
    }

    const block = blocks.find((b) => b.id === id);

    return block ? (
      <FreePart key={id} id={id} pos={positions[id]} edit={edit} style={centered}>
        <Block block={block} design={design} />
      </FreePart>
    ) : null;
  };

  const zoneStyle = (name) => ({
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
    minWidth: 0,
    justifyContent: name === 'left' ? 'flex-start' : name === 'center' ? 'center' : 'flex-end',
  });

  // Parts stay inside their flow area in the markup; placed ones are positioned absolutely
  // against the header row, so picking one up never remounts it mid-drag.
  const content = (
    <div
      ref={innerRef}
      style={{ ...inner, position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto 1fr', justifyContent: 'normal' }}
    >
      {['left', 'center', 'right'].map((name) => (
        <div key={name} style={zoneStyle(name)}>
          {zones[name].map(renderPart)}
        </div>
      ))}
    </div>
  );

  return (
    <div style={bar}>
      {content}
    </div>
  );
}

function FooterPreview({ design, items, mobile }) {
  const { layout, colors, typography, footer } = design;
  const columns = mobile ? 1 : layout.columns;

  return (
    <footer
      style={{
        background: colors.background,
        borderTop: layout.borderBottom ? `${layout.borderWidth}px solid ${colors.border}` : 'none',
      }}
    >
      <div
        style={{
          maxWidth: layout.width === 'container' ? layout.maxWidth : '100%',
          margin: '0 auto',
          padding: `32px ${layout.paddingX}px`,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Logo design={design} />
        </div>

        {items.length === 0 ? (
          <p style={{ color: colors.text, opacity: 0.6, fontSize: 13 }}>
            Add menu items to preview them here.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: layout.itemGap,
            }}
          >
            {items.map((item) => (
              <div key={item.id} style={{ opacity: item.status === 'published' ? 1 : 0.5 }}>
                <div style={{ ...textStyle(design, colors.text), fontWeight: 700, marginBottom: 12 }}>
                  {item.title}
                </div>
                <ul style={{ margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                  {flattenItems(item.children || []).map((child) => (
                    <li key={child.id} style={{ listStyle: 'none', paddingLeft: child.depth * 14 }}>
                      <span style={textStyle(design, colors.text)}>{child.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: `14px ${layout.paddingX}px`,
          textAlign: 'center',
          color: colors.text,
          fontFamily: typography.fontFamily,
          fontSize: 13,
          opacity: 0.8,
        }}
      >
        {footer.copyright}
      </div>
    </footer>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: 24, flex: 1 }}>
      {[80, 60, 90, 50].map((width) => (
        <div
          key={width}
          style={{ height: 12, width: `${width}%`, background: '#e5e7eb', borderRadius: 6, marginBottom: 12 }}
        />
      ))}
    </div>
  );
}

export function MenuPreview({ design, items = [], device = 'desktop', onMovePart, onResetPart }) {
  const mobile = device === 'mobile';
  const isFooter = design.variant === 'footer';

  return (
    <div
      style={{
        width: mobile ? 375 : '100%',
        margin: '0 auto',
        minHeight: 380,
        display: 'flex',
        flexDirection: 'column',
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      }}
    >
      {isFooter ? (
        <>
          <Skeleton />
          <FooterPreview design={design} items={items} mobile={mobile} />
        </>
      ) : (
        <>
          <HeaderPreview
            design={design}
            items={items}
            mobile={mobile}
            onMovePart={onMovePart}
            onResetPart={onResetPart}
          />
          <Skeleton />
        </>
      )}
    </div>
  );
}