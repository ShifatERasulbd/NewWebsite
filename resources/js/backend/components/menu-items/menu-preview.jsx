import { Menu as MenuIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { getPositions, HEADER_ICONS, resolveOrder, resolveZones } from '@/backend/pages/Menu-items/designDefaults';
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

function Block({ block, design, items = [] }) {
  const { colors, button, typography, dropdown } = design;
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const stop = (e) => e.preventDefault();

  if (block.type === 'icon') {
    const def = HEADER_ICONS.find((icon) => icon.value === block.icon) || HEADER_ICONS[0];
    const Icon = def.Icon;

    return (
      <a
        href="#"
        onClick={stop}
        title={def.label}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hover ? colors.hover : colors.text,
          cursor: 'pointer',
          transition: 'color 0.15s',
        }}
      >
        <Icon size={block.size || 22} strokeWidth={1.75} />
        {block.badge && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -9,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: 8,
              background: colors.active,
              color: colors.background,
              fontFamily: typography.fontFamily,
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            2
          </span>
        )}
      </a>
    );
  }

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

  if (block.type === 'menu-items') {
    return (
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <a href="#" onClick={stop} style={textStyle(design, colors.text)}>
          {block.text || 'Menu Items ▾'}
        </a>
        {open && items.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              minWidth: dropdown.width || 220,
              margin: 0,
              padding: '6px 0',
              background: colors.dropdownBg,
              border: `1px solid ${colors.border}`,
              borderRadius: dropdown.radius,
              boxShadow: dropdown.shadow ? '0 10px 30px rgba(0, 0, 0, 0.15)' : 'none',
              zIndex: 30,
            }}
          >
            {items.map((item) => (
              <NavItem key={item.id} item={item} design={design} depth={1} />
            ))}
          </ul>
        )}
      </div>
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

function MobileList({ design, items }) {
  const { colors, layout } = design;
  const blocks = resolveOrder(design)
    .map((id) => (design.blocks || []).find((b) => b.id === id))
    .filter((block) => block && block.type !== 'icon');

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {blocks.map((block) => (
              <Block key={block.id} block={block} design={design} items={items} />
            ))}
          </div>
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

function HeaderPreview({
  design,
  items,
  mobile,
  onMovePart,
  onResetPart,
  onDropIcon,
  selectedId: selectedIdProp,
  onSelectPart,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState(null);
  const selectedId = selectedIdProp !== undefined ? selectedIdProp : localSelected;
  const setSelectedId = (id) => {
    setLocalSelected(id);
    if (onSelectPart) onSelectPart(id);
  };
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

    const iconBlocks = (design.blocks || []).filter((block) => block.type === 'icon');
    const icons =
      iconBlocks.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {iconBlocks.map((block) => (
            <Block key={block.id} block={block} design={design} items={items} />
          ))}
        </div>
      ) : null;

    return (
      <div style={bar}>
        <div style={{ ...inner, justifyContent: 'space-between' }}>
          {mobileSettings.burgerPosition === 'left' ? (
            <>
              {burger}
              <Logo design={design} />
              {icons}
            </>
          ) : (
            <>
              <Logo design={design} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {icons}
                {burger}
              </div>
            </>
          )}
        </div>
        {menuOpen && <MobileList design={design} items={items} />}
      </div>
    );
  }

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
  const flatItems = flattenItems(items);
  const placedItems = flatItems.filter((item) => positions[`menu-item-${item.id}`]);

  const measure = (el) => {
    const container = innerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    return { x: Math.round(rect.left - container.left), y: Math.round(rect.top - container.top) };
  };

  // Keep a part fully inside the header bar
  const clampPos = (pos, el) => {
    const container = innerRef.current;
    if (!container) return pos;

    const width = el ? el.offsetWidth : 0;
    const height = el ? el.offsetHeight : 0;
    const maxX = Math.max(0, container.clientWidth - width);
    const maxY = Math.max(0, container.clientHeight - height);

    return {
      x: Math.min(Math.max(0, pos.x), maxX),
      y: Math.min(Math.max(0, pos.y), maxY),
    };
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
            el: e.currentTarget,
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
          onMovePart(
            drag.id,
            clampPos({ x: Math.round(drag.origin.x + dx), y: Math.round(drag.origin.y + dy) }, drag.el)
          );
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
          onMovePart(id, clampPos({ x: origin.x + delta[0], y: origin.y + delta[1] }, e.currentTarget));
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
        <Block block={block} design={design} items={items} />
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

      {placedItems.map((item) => {
        const id = `menu-item-${item.id}`;

        return (
          <FreePart key={id} id={id} pos={positions[id]} edit={edit} style={centered}>
            <ul style={{ display: 'flex', margin: 0, padding: 0 }}>
              <NavItem item={item} design={design} active={flatItems[0]?.id === item.id} />
            </ul>
          </FreePart>
        );
      })}
    </div>
  );

  return (
    <div
      style={bar}
      onPointerDown={(e) => {
        // Clicking empty space in the header clears the selection
        if (editing && !e.target.closest('[data-part]')) setSelectedId(null);
      }}
      onDragOver={(e) => {
        const types = Array.from(e.dataTransfer.types);

        if (editing && (types.includes('application/x-menu-item') || types.includes('application/x-header-icon'))) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDrop={(e) => {
        const iconName = e.dataTransfer.getData('application/x-header-icon');

        if (editing && iconName && onDropIcon && innerRef.current) {
          e.preventDefault();
          const box = innerRef.current.getBoundingClientRect();
          onDropIcon(
            iconName,
            clampPos(
              { x: Math.round(e.clientX - box.left - 11), y: Math.round(e.clientY - box.top - 11) },
              { offsetWidth: 24, offsetHeight: 24 }
            )
          );
          return;
        }

        const id = e.dataTransfer.getData('application/x-menu-item');
        if (!editing || !id || !innerRef.current) return;
        e.preventDefault();
        const rect = innerRef.current.getBoundingClientRect();
        onMovePart(
          id,
          clampPos(
            { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top - 10) },
            { offsetWidth: 80, offsetHeight: 24 }
          )
        );
      }}
    >
      {content}
    </div>
  );
}

function FooterBlock({ block, design }) {
  const { colors, typography } = design;
  const stop = (e) => e.preventDefault();
  const links = (block.links || []).filter((link) => link.label || link.url);

  const heading = block.title ? (
    <div
      style={{
        ...textStyle(design, colors.active),
        cursor: 'default',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: `${Math.max(typography.letterSpacing, 2)}px`,
        fontSize: typography.fontSize + 2,
        marginBottom: 18,
      }}
    >
      {block.title}
    </div>
  ) : null;

  const bodyStyle = { ...textStyle(design, colors.text), cursor: 'default', whiteSpace: 'pre-line', lineHeight: 1.6 };

  if (block.type === 'menu') {
    return (
      <div>
        {heading}
        {links.length === 0 ? (
          <span style={{ ...bodyStyle, opacity: 0.5 }}>No links yet</span>
        ) : (
          <ul style={{ margin: 0, padding: 0, display: 'grid', gap: 14 }}>
            {links.map((link, index) => (
              <li key={index} style={{ listStyle: 'none' }}>
                <a href="#" onClick={stop} style={textStyle(design, colors.text)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (block.type === 'text') {
    return (
      <div>
        {heading}
        <div style={bodyStyle}>{block.text}</div>
      </div>
    );
  }

  if (block.type === 'contact') {
    return (
      <div>
        {heading}
        <div style={{ display: 'grid', gap: 8 }}>
          {block.address && <div style={bodyStyle}>{block.address}</div>}
          {block.phone && <div style={bodyStyle}>{block.phone}</div>}
          {block.email && <div style={bodyStyle}>{block.email}</div>}
        </div>
      </div>
    );
  }

  if (block.type === 'social') {
    const active = (block.links || []).filter((link) => link.url);
    const shown = active.length ? active : [{ label: 'facebook' }, { label: 'instagram' }];

    return (
      <div>
        {heading}
        <div style={{ display: 'flex', gap: 8, opacity: active.length ? 1 : 0.4 }}>
          {shown.map((link, index) => {
            const badge = SOCIAL_BADGES.find(([key]) => key === String(link.label).toLowerCase())?.[1] || '•';

            return (
              <a
                key={index}
                href="#"
                onClick={stop}
                style={{
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  border: `1px solid ${colors.text}`,
                  color: colors.active,
                  fontFamily: typography.fontFamily,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {badge}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  if (block.type === 'newsletter') {
    return (
      <div>
        {heading}
        {block.email && <div style={{ ...bodyStyle, marginBottom: 22 }}>{block.email}</div>}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: 10,
          }}
        >
          <input
            readOnly
            placeholder={block.placeholder || 'Email address'}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: colors.text,
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize,
            }}
          />
          <span
            style={{
              ...textStyle(design, colors.active),
              cursor: 'default',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {block.buttonLabel || 'Join'}
          </span>
        </div>
      </div>
    );
  }

  return null;
}

function FooterImages({ design, align }) {
  const { footer, colors } = design;
  const section = footer.imagesSection || {};
  const images = (footer.images || []).filter((image) => image.url);

  if (!section.enabled || images.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
      {section.title ? (
        <div style={{ ...textStyle(design, colors.text), cursor: 'default', fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
          {section.title}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: align, gap: section.gap ?? 8 }}>
        {images.map((image) => (
          <img key={image.id} src={image.url} alt={image.alt || ''} style={{ height: section.height || 28, width: 'auto' }} />
        ))}
      </div>
    </div>
  );
}

function FooterPreview({
  design,
  items,
  mobile,
  onMovePart,
  onResetPart,
  onResizeFooter,
  selectedId: selectedIdProp,
  onSelectPart,
}) {
  const { layout, colors, typography, footer } = design;
  const [localSelected, setLocalSelected] = useState(null);
  const selectedId = selectedIdProp !== undefined ? selectedIdProp : localSelected;
  const setSelectedId = (id) => {
    setLocalSelected(id);
    if (onSelectPart) onSelectPart(id);
  };
  const footerRef = useRef(null);
  const dragRef = useRef(null);

  const columns = mobile ? 1 : layout.columns;
  const legacyBlocks = design.blocks || [];
  const footerBlocks = footer.blocks || [];
  const hasBlocks = footerBlocks.length > 0;
  const underLogo = footerBlocks.filter((block) => block.underLogo);
  const sideBlocks = footerBlocks.filter((block) => !block.underLogo);
  const positions = getPositions(design, mobile);
  const editing = Boolean(onMovePart);

  const section = footer.imagesSection || {};
  const hasImages = Boolean(section.enabled) && (footer.images || []).some((image) => image.url);
  const imagesAtTop = hasImages && section.position === 'top';
  const imagesAtBottom = hasImages && section.position !== 'top';

  const measure = (el) => {
    const container = footerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return { x: Math.round(rect.left - container.left), y: Math.round(rect.top - container.top) };
  };

  // Keep a part fully inside the footer
  const clampPos = (pos, el) => {
    const container = footerRef.current;
    if (!container) return pos;

    const maxX = Math.max(0, container.clientWidth - (el ? el.offsetWidth : 0));
    const maxY = Math.max(0, container.clientHeight - (el ? el.offsetHeight : 0));

    return { x: Math.min(Math.max(0, pos.x), maxX), y: Math.min(Math.max(0, pos.y), maxY) };
  };

  const footerHeight = (mobile ? layout.footerHeightMobile : layout.footerHeight) || 0;
  const resizeRef = useRef(null);

  // Drag the handle on the footer's bottom edge to change its (minimum) height
  const resizeHandlers =
    onResizeFooter
      ? {
          onPointerDown: (e) => {
            if (e.button !== 0 || !footerRef.current) return;
            e.preventDefault();
            resizeRef.current = { startY: e.clientY, startHeight: footerRef.current.offsetHeight };
            e.currentTarget.setPointerCapture(e.pointerId);
          },
          onPointerMove: (e) => {
            const drag = resizeRef.current;
            if (!drag) return;
            const next = Math.round(drag.startHeight + (e.clientY - drag.startY));
            onResizeFooter(Math.min(Math.max(next, 120), 1000));
          },
          onPointerUp: (e) => {
            resizeRef.current = null;
            if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
          },
          onDoubleClick: () => onResizeFooter(0), // back to auto height
        }
      : null;

  const edit = editing
    ? {
        selectedId,
        select: setSelectedId,
        reset: (id) => onResetPart && onResetPart(id),
        begin: (e, id) => {
          if (e.button !== 0 || !footerRef.current) return;
          dragRef.current = {
            id,
            el: e.currentTarget,
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
          onMovePart(
            drag.id,
            clampPos({ x: Math.round(drag.origin.x + dx), y: Math.round(drag.origin.y + dy) }, drag.el)
          );
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
          if (!delta || !footerRef.current) return;
          e.preventDefault();
          const origin = positions[id] || measure(e.currentTarget);
          onMovePart(id, clampPos({ x: origin.x + delta[0], y: origin.y + delta[1] }, e.currentTarget));
        },
      }
    : null;

  const container = layout.width === 'container' ? layout.maxWidth : '100%';

  return (
    <footer
      onPointerDown={(e) => {
        // Clicking empty space in the footer clears the selection
        if (editing && !e.target.closest('[data-part], [data-keep-selection]')) setSelectedId(null);
      }}
      style={{
        background: colors.background,
        borderTop: layout.borderBottom ? `${layout.borderWidth}px solid ${colors.border}` : 'none',
      }}
    >
      <div
        ref={footerRef}
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          minHeight: footerHeight > 0 ? footerHeight : undefined,
          maxWidth: container,
          margin: '0 auto',
          padding: `32px ${layout.paddingX}px`,
        }}
      >
        {imagesAtTop && (
          <div style={{ marginBottom: 24 }}>
            <FooterImages design={design} align={section.align || 'flex-start'} />
          </div>
        )}

        {hasBlocks ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: columns < 2 ? '1fr' : `1.5fr repeat(${columns - 1}, minmax(0, 1fr))`,
              gap: layout.itemGap,
              alignItems: 'start',
            }}
          >
            <div>
              <FreePart id="logo" pos={positions['logo']} edit={edit} style={{ marginBottom: 20 }}>
                <Logo design={design} />
              </FreePart>

              {underLogo.map((block) => (
                <FreePart key={block.id} id={block.id} pos={positions[block.id]} edit={edit} style={{ marginTop: 16 }}>
                  <FooterBlock block={block} design={design} />
                </FreePart>
              ))}
            </div>

            {sideBlocks.map((block) => (
              <FreePart
                key={block.id}
                id={block.id}
                pos={positions[block.id]}
                edit={edit}
                style={{ gridColumn: `span ${Math.min(Math.max(block.span || 1, 1), columns)}` }}
              >
                <FooterBlock block={block} design={design} />
              </FreePart>
            ))}
          </div>
        ) : (
          <>
            <FreePart id="logo" pos={positions['logo']} edit={edit} style={{ marginBottom: 24 }}>
              <Logo design={design} />
            </FreePart>

            {items.length === 0 ? (
              <p style={{ color: colors.text, opacity: 0.6, fontSize: 13 }}>
                Add menu items or footer blocks to preview them here.
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

            {legacyBlocks.map((block) => (
              <FreePart key={block.id} id={block.id} pos={positions[block.id]} edit={edit} style={{ marginTop: 16 }}>
                <Block block={block} design={design} items={items} />
              </FreePart>
            ))}
          </>
        )}

        {resizeHandlers && (
          <div
            {...resizeHandlers}
            data-keep-selection
            title="Drag to change footer height (double-click to reset)"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 12,
              cursor: 'ns-resize',
              touchAction: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 40,
            }}
          >
            <span style={{ width: 48, height: 4, borderRadius: 2, background: colors.text, opacity: 0.45 }} />
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}`, padding: `14px ${layout.paddingX}px` }}>
        <div
          style={{
            maxWidth: container,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: imagesAtBottom ? 'space-between' : 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              color: colors.text,
              fontFamily: typography.fontFamily,
              fontSize: 13,
              opacity: 0.8,
            }}
          >
            {footer.copyright}
          </span>
          {imagesAtBottom && <FooterImages design={design} align="flex-end" />}
        </div>
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

export function MenuPreview({
  design,
  items = [],
  device = 'desktop',
  onMovePart,
  onResetPart,
  onResizeFooter,
  onDropIcon,
  selectedId,
  onSelectPart,
}) {
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
          <FooterPreview
            design={design}
            items={items}
            mobile={mobile}
            onMovePart={onMovePart}
            onResetPart={onResetPart}
            onResizeFooter={onResizeFooter}
            selectedId={selectedId}
            onSelectPart={onSelectPart}
          />
        </>
      ) : (
        <>
          <HeaderPreview
            design={design}
            items={items}
            mobile={mobile}
            onMovePart={onMovePart}
            onResetPart={onResetPart}
            onDropIcon={onDropIcon}
            selectedId={selectedId}
            onSelectPart={onSelectPart}
          />
          <Skeleton />
        </>
      )}
    </div>
  );
}