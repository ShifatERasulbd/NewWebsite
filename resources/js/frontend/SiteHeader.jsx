import { useEffect, useState } from 'react';

import { HeaderPreview, LiveContext } from '@/backend/components/menu-items/menu-preview';
import { getDefaultDesign, mergeDesign } from '@/backend/pages/Menu-items/designDefaults';

// True when the viewport is at or below the breakpoint saved in the design
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint}px)`;
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMobile(media.matches);

    onChange();
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return mobile;
}

export default function SiteHeader({ config }) {
  const design = mergeDesign(getDefaultDesign('header'), config?.design);
  const mobile = useIsMobile(design.mobile?.breakpoint);

  return (
    <div style={design.layout.sticky ? { position: 'sticky', top: 0, zIndex: 50 } : undefined}>
      <LiveContext.Provider value>
        <HeaderPreview design={design} items={config?.items ?? []} mobile={mobile} />
      </LiveContext.Provider>
    </div>
  );
}
