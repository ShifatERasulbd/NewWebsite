import { FooterPreview, LiveContext } from '@/backend/components/menu-items/menu-preview';
import { getDefaultDesign, mergeDesign } from '@/backend/pages/Menu-items/designDefaults';

import { useIsMobile } from './SiteHeader';

export default function SiteFooter({ config }) {
  const design = mergeDesign(getDefaultDesign('footer'), config?.design);
  const mobile = useIsMobile(design.mobile?.breakpoint);

  return (
    <LiveContext.Provider value>
      <FooterPreview design={design} items={config?.items ?? []} mobile={mobile} />
    </LiveContext.Provider>
  );
}
