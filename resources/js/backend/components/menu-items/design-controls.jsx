import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/backend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/backend/components/ui/card';
import { Input } from '@/backend/components/ui/input';
import { Label } from '@/backend/components/ui/label';
import { FONT_OPTIONS, getPositions, resolveOrder } from '@/backend/pages/Menu-items/designDefaults';
import { flattenItems } from '@/backend/pages/Menu-items/utils';

const selectClass =
  'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

const BLOCK_TYPES = [
  { label: 'Custom text', value: 'text' },
  { label: 'Phone number', value: 'phone' },
  { label: 'Search box', value: 'search' },
  { label: 'Social icons', value: 'social' },
  { label: 'Button', value: 'button' },
  { label: 'Menu Items', value: 'menu-items' },
];

const SOCIAL_FIELDS = [
  ['facebook', 'Facebook URL'],
  ['instagram', 'Instagram URL'],
  ['x', 'X (Twitter) URL'],
  ['linkedin', 'LinkedIn URL'],
  ['youtube', 'YouTube URL'],
];

const BLOCK_DEFAULTS = {
  text: { text: 'Free shipping on all orders' },
  phone: { text: '+1 555 123 4567' },
  search: { text: 'Search...' },
  social: {},
  button: { text: 'Sign in', url: '/login', variant: 'outline' },
  'menu-items': { text: 'Menu Items ▾' },
};

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function RangeField({ label, value, onChange, min, max, step = 1, unit = 'px' }) {
  return (
    <Field label={`${label}: ${value}${unit}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </Field>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-input bg-transparent p-0.5"
        />
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
    </Field>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <Field label={label}>
      <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  );
}

function BlockCard({ block, onUpdate, onRemove }) {
  const typeLabel = BLOCK_TYPES.find((t) => t.value === block.type)?.label || block.type;
  const update = (key) => (value) => onUpdate(block.id, key, value);

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{typeLabel}</span>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="outline" onClick={() => onRemove(block.id)}>
            Remove
          </Button>
        </div>
      </div>

      {block.type === 'text' && <TextField label="Text" value={block.text} onChange={update('text')} />}
      {block.type === 'phone' && <TextField label="Phone number" value={block.text} onChange={update('text')} />}
      {block.type === 'search' && <TextField label="Placeholder" value={block.text} onChange={update('text')} />}
      {block.type === 'menu-items' && <TextField label="Dropdown Label" value={block.text} onChange={update('text')} />}
      {block.type === 'social' &&
        SOCIAL_FIELDS.map(([key, label]) => (
          <TextField key={key} label={label} value={block[key]} onChange={update(key)} placeholder="https://" />
        ))}
      {block.type === 'button' && (
        <>
          <TextField label="Button label" value={block.text} onChange={update('text')} />
          <TextField label="Button URL" value={block.url} onChange={update('url')} placeholder="/login" />
          <SelectField
            label="Style"
            value={block.variant || 'filled'}
            onChange={update('variant')}
            options={[
              { label: 'Filled', value: 'filled' },
              { label: 'Outline', value: 'outline' },
            ]}
          />
        </>
      )}
    </div>
  );
}

export default function DesignControls({ design, items = [], onChange, onUploadLogo }) {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('layout');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);
  const [newBlockType, setNewBlockType] = useState('text');
  const isHeader = design.variant === 'header';
  const { layout, logo, colors, typography, mobile, footer } = design;

  // Flatten nested items so all menu items appear in the tab
  const flatMenuItems = flattenItems(items);

  const set = (path) => (value) => onChange(path, value);

  const blocks = design.blocks || [];
  const MAX_BLOCKS = 12;

  const addBlock = () => {
    if (blocks.length >= MAX_BLOCKS) return;
    const id = `${newBlockType}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
    onChange('blocks', [...blocks, { id, type: newBlockType, ...BLOCK_DEFAULTS[newBlockType] }]);
  };

  const updateBlock = (id, key, value) =>
    onChange('blocks', blocks.map((b) => (b.id === id ? { ...b, [key]: value } : b)));

  const removeBlock = (id) => {
    onChange('blocks', blocks.filter((b) => b.id !== id));
    if (getPositions(design)[id]) {
      const next = { ...getPositions(design) };
      delete next[id];
      onChange('positions', next);
    }
  };

  const orderedBlocks = resolveOrder(design)
    .map((id) => blocks.find((b) => b.id === id))
    .filter(Boolean);

  const positions = getPositions(design);

  const partLabel = (id) => {
    if (id === 'logo') return 'Logo';
    if (id === 'cta') return 'Button (CTA)';
    if (id.startsWith('menu-item-')) {
      const itemId = id.replace('menu-item-', '');
      const found = flatMenuItems.find((i) => String(i.id) === String(itemId));
      return found ? `Menu Item: ${found.title}` : `Menu Item #${itemId}`;
    }
    const block = blocks.find((b) => b.id === id);
    return BLOCK_TYPES.find((t) => t.value === block?.type)?.label || id;
  };

  const baseOrder = resolveOrder(design);
  const partList = [];

  baseOrder.forEach((id) => {
    if (id === 'menu') {
      flatMenuItems.forEach((item) => {
        partList.push({ id: `menu-item-${item.id}`, label: partLabel(`menu-item-${item.id}`) });
      });
    } else {
      partList.push({ id, label: partLabel(id) });
    }
  });

  const setPosition = (id, patch) =>
    onChange('positions', { ...positions, [id]: { ...positions[id], ...patch } });

  const resetPosition = (id) => {
    const next = { ...positions };
    delete next[id];
    onChange('positions', next);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadLogo) return;

    setUploading(true);
    setUploadError('');

    try {
      const url = await onUploadLogo(file);
      onChange('logo.imageUrl', url);
    } catch (error) {
      setUploadError(error.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const tabs = [
    { id: 'layout', label: 'Layout' },
    { id: 'logo', label: 'Logo' },
    { id: 'colors', label: 'Colors' },
    { id: 'text', label: 'Text' },
    { id: 'menuItems', label: isHeader ? 'Menu Items' : 'Footer' },
    { id: 'blocks', label: 'Blocks' },
    { id: 'mobile', label: 'Mobile' },
  ];

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {isHeader ? 'Header' : 'Footer'} design
        </CardTitle>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {tabs.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={tab === item.id ? 'default' : 'outline'}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {tab === 'layout' && (
          <>
            <SelectField
              label="Width"
              value={layout.width}
              onChange={set('layout.width')}
              options={[
                { label: 'Contained', value: 'container' },
                { label: 'Full width', value: 'full' },
              ]}
            />
            {layout.width === 'container' && (
              <RangeField label="Max width" value={layout.maxWidth} onChange={set('layout.maxWidth')} min={600} max={1920} step={10} />
            )}
            {isHeader && (
              <RangeField label="Height" value={layout.height} onChange={set('layout.height')} min={40} max={160} />
            )}
            <RangeField label="Side padding" value={layout.paddingX} onChange={set('layout.paddingX')} min={0} max={80} />
            <RangeField label="Item gap" value={layout.itemGap} onChange={set('layout.itemGap')} min={0} max={64} />
            {isHeader ? (
              <>
                <SelectField
                  label="Logo position"
                  value={layout.logoPosition}
                  onChange={set('layout.logoPosition')}
                  options={[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' },
                  ]}
                />
                <ToggleField label="Sticky header" value={layout.sticky} onChange={set('layout.sticky')} />
                <ToggleField label="Drop shadow" value={layout.shadow} onChange={set('layout.shadow')} />
              </>
            ) : (
              <RangeField label="Columns" value={layout.columns} onChange={set('layout.columns')} min={1} max={6} unit="" />
            )}
            <ToggleField
              label={isHeader ? 'Bottom border' : 'Top border'}
              value={layout.borderBottom}
              onChange={set('layout.borderBottom')}
            />
            {layout.borderBottom && (
              <RangeField label="Border width" value={layout.borderWidth} onChange={set('layout.borderWidth')} min={1} max={6} />
            )}
          </>
        )}

        {tab === 'logo' && (
          <>
            <SelectField
              label="Logo type"
              value={logo.type}
              onChange={set('logo.type')}
              options={[
                { label: 'Text', value: 'text' },
                { label: 'Image', value: 'image' },
                { label: 'None', value: 'none' },
              ]}
            />
            {logo.type === 'text' && (
              <TextField
                label="Logo text"
                value={logo.text}
                onChange={set('logo.text')}
                placeholder="AVANT"
              />
            )}
            {logo.type === 'image' && (
              <>
                <Field label="Logo image">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFile}
                    disabled={uploading}
                    className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {uploading ? 'Uploading...' : 'PNG, JPG, WEBP or GIF, up to 2 MB.'}
                  </p>
                  {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
                </Field>

                {logo.imageUrl && (
                  <div className="space-y-2 rounded-md border p-3">
                    <img src={logo.imageUrl} alt="Logo preview" style={{ height: logo.height, maxWidth: '100%' }} />
                    <Button type="button" size="sm" variant="outline" onClick={() => set('logo.imageUrl')('')}>
                      Remove image
                    </Button>
                  </div>
                )}

                <TextField label="Image URL" value={logo.imageUrl} onChange={set('logo.imageUrl')} placeholder="/frontend/logo.png" />
              </>
            )}
            {logo.type !== 'none' && (
              <RangeField
                label={logo.type === 'image' ? 'Resize logo (height)' : 'Logo height'}
                value={logo.height}
                onChange={set('logo.height')}
                min={16}
                max={96}
              />
            )}
          </>
        )}

        {tab === 'colors' && (
          <>
            <ColorField label="Background" value={colors.background} onChange={set('colors.background')} />
            <ColorField label="Text" value={colors.text} onChange={set('colors.text')} />
            <ColorField label="Hover" value={colors.hover} onChange={set('colors.hover')} />
            <ColorField label="Active item" value={colors.active} onChange={set('colors.active')} />
            <ColorField label="Border" value={colors.border} onChange={set('colors.border')} />
            {isHeader && (
              <>
                <ColorField label="Dropdown background" value={colors.dropdownBg} onChange={set('colors.dropdownBg')} />
                <ColorField label="Dropdown text" value={colors.dropdownText} onChange={set('colors.dropdownText')} />
              </>
            )}
          </>
        )}

        {tab === 'text' && (
          <>
            {logo.type === 'text' && (
              <TextField
                label="Logo text"
                value={logo.text}
                onChange={set('logo.text')}
                placeholder="AVANT"
              />
            )}
            <SelectField
              label="Font"
              value={typography.fontFamily}
              onChange={set('typography.fontFamily')}
              options={FONT_OPTIONS}
            />
            <RangeField label="Font size" value={typography.fontSize} onChange={set('typography.fontSize')} min={10} max={28} />
            <Field label="Font weight">
              <select
                value={typography.fontWeight}
                onChange={(e) => onChange('typography.fontWeight', Number(e.target.value))}
                className={selectClass}
              >
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>Semibold</option>
                <option value={700}>Bold</option>
              </select>
            </Field>
            <RangeField label="Letter spacing" value={typography.letterSpacing} onChange={set('typography.letterSpacing')} min={0} max={4} step={0.5} />
            <ToggleField label="Uppercase" value={typography.uppercase} onChange={set('typography.uppercase')} />
          </>
        )}

        {tab === 'menuItems' && isHeader && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                All items from the menu items module. Drag each item individually in the preview or configure their positions below.
              </p>
              <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/menus/${menuId}`)}>
                Manage Items
              </Button>
            </div>

            {flatMenuItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No menu items found.</p>
            ) : (
              flatMenuItems.map((item) => {
                const posId = `menu-item-${item.id}`;
                const pos = positions[posId];

                return (
                  <div key={item.id} className="space-y-2 rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.title}</span>
                      {pos && (
                        <Button type="button" size="sm" variant="outline" onClick={() => resetPosition(posId)}>
                          Back to flow
                        </Button>
                      )}
                    </div>
                    {pos ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="X (px)">
                          <Input type="number" value={pos.x} onChange={(e) => setPosition(posId, { x: Number(e.target.value) || 0 })} />
                        </Field>
                        <Field label="Y (px)">
                          <Input type="number" value={pos.y} onChange={(e) => setPosition(posId, { y: Number(e.target.value) || 0 })} />
                        </Field>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">In normal flow. Drag it in the live preview.</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'menuItems' && !isHeader && (
          <TextField label="Copyright text" value={footer.copyright} onChange={set('footer.copyright')} />
        )}

        {tab === 'blocks' && (
          <>
            <p className="text-xs text-muted-foreground">
              Add extra parts to the {isHeader ? 'header' : 'footer'}. Drag the logo, menu items and blocks anywhere in the live preview. Click a part and use the arrow keys to nudge it 1px (Shift: 10px). Double-click a part to put it back in the normal flow.
            </p>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <SelectField label="Block type" value={newBlockType} onChange={setNewBlockType} options={BLOCK_TYPES} />
              </div>
              <Button type="button" size="sm" onClick={addBlock} disabled={blocks.length >= MAX_BLOCKS}>
                Add block
              </Button>
            </div>

            {blocks.length === 0 && <p className="text-sm text-muted-foreground">No extra blocks yet.</p>}

            {orderedBlocks.map((block) => (
              <BlockCard key={block.id} block={block} onUpdate={updateBlock} onRemove={removeBlock} />
            ))}

            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium">Placement</p>
              {partList.map(({ id, label }) => {
                const pos = positions[id];

                return pos ? (
                  <div key={id} className="space-y-2 rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm">{label}</span>
                      <Button type="button" size="sm" variant="outline" onClick={() => resetPosition(id)}>
                        Back to flow
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="X (px)">
                        <Input type="number" value={pos.x} onChange={(e) => setPosition(id, { x: Number(e.target.value) || 0 })} />
                      </Field>
                      <Field label="Y (px)">
                        <Input type="number" value={pos.y} onChange={(e) => setPosition(id, { y: Number(e.target.value) || 0 })} />
                      </Field>
                    </div>
                  </div>
                ) : (
                  <p key={id} className="text-xs text-muted-foreground">
                    {label}: in normal flow. Drag it in the preview to place it freely.
                  </p>
                );
              })}
            </div>
          </>
        )}

        {tab === 'mobile' && (
          <>
            <RangeField label="Mobile breakpoint" value={mobile.breakpoint} onChange={set('mobile.breakpoint')} min={480} max={1200} step={10} />
            {isHeader && (
              <SelectField
                label="Menu button position"
                value={mobile.burgerPosition}
                onChange={set('mobile.burgerPosition')}
                options={[
                  { label: 'Left', value: 'left' },
                  { label: 'Right', value: 'right' },
                ]}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}