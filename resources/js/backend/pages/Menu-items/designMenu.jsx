import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import DesignControls from '@/backend/components/menu-items/design-controls';
import { MenuPreview } from '@/backend/components/menu-items/menu-preview';
import { Button } from '@/backend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/backend/components/ui/card';
import { useAppContext } from '@/backend/context/AppContext';
import { fetchMenuDesign, saveMenuDesign, uploadMenuLogo } from '@/backend/pages/Menu/api';

import { fetchMenuItems } from './api';
import { detectVariant, getDefaultDesign, mergeDesign, setIn } from './designDefaults';

export default function DesignMenu() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { setPageTitle } = useAppContext();

  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [design, setDesign] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [device, setDevice] = useState('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setPageTitle(menu ? `Design: ${menu.title}` : 'Design Menu');
  }, [setPageTitle, menu]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [data, itemData] = await Promise.all([fetchMenuDesign(menuId), fetchMenuItems(menuId)]);

        if (ignore) return;

        const merged = mergeDesign(getDefaultDesign(detectVariant(data.title)), data.design);

        setMenu({ id: data.id, title: data.title });
        setItems(itemData);
        setDesign(merged);
        setSavedSnapshot(JSON.stringify(merged));
      } catch (error) {
        if (!ignore) setErrorMessage(error.message || 'Failed to load menu design.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [menuId]);

  const handleChange = (path, value) => setDesign((previous) => setIn(previous, path, value));

  const handleReset = () => setDesign(getDefaultDesign(design.variant));

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await saveMenuDesign(menuId, design);
      setSavedSnapshot(JSON.stringify(design));
      toast.success('Menu design saved successfully.', { style: { color: '#16a34a' } });
    } catch (error) {
      const fieldErrors = error.payload?.errors || {};
      const first = Object.values(fieldErrors)[0]?.[0];
      toast.error(first || error.message || 'Failed to save design.', { style: { color: '#dc2626' } });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!design) {
    return <p className="text-sm text-destructive">{errorMessage || 'Menu not found.'}</p>;
  }

  const isDirty = JSON.stringify(design) !== savedSnapshot;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/menus/${menuId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {menu.title} items
        </Button>

        <div className="flex items-center gap-2">
          {isDirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          <Button variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save design'}
          </Button>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Live preview</CardTitle>
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={device === 'desktop' ? 'default' : 'outline'}
                onClick={() => setDevice('desktop')}
              >
                <Monitor className="mr-1.5 h-4 w-4" />
                Desktop
              </Button>
              <Button
                type="button"
                size="sm"
                variant={device === 'mobile' ? 'default' : 'outline'}
                onClick={() => setDevice('mobile')}
              >
                <Smartphone className="mr-1.5 h-4 w-4" />
                Mobile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MenuPreview
              design={design}
              items={items}
              device={device}
              onMovePart={(id, pos) =>
                setDesign((previous) => ({
                  ...previous,
                  positions: {
                    ...(previous.positions && !Array.isArray(previous.positions) ? previous.positions : {}),
                    [id]: pos,
                  },
                }))
              }
              onResetPart={(id) =>
                setDesign((previous) => {
                  const next = { ...(previous.positions && !Array.isArray(previous.positions) ? previous.positions : {}) };
                  delete next[id];
                  return { ...previous, positions: next };
                })
              }
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Drag the logo, menu and blocks (dashed outlines) anywhere in the header on desktop. Click one and use the arrow keys to nudge it 1px (Shift: 10px). Double-click to put it back in the flow. Hover a menu item with children to preview its dropdown. Draft items show faded.
            </p>
          </CardContent>
        </Card>

        <DesignControls
          design={design}
          onChange={handleChange}
          onUploadLogo={(file) => uploadMenuLogo(menuId, file)}
        />
      </div>
    </div>
  );
}