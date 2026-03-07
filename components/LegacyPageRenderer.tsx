import { loadLegacyHtml } from '@/lib/html-loader';
import { GlobalRouteBar } from './GlobalRouteBar';

type LegacyPageRendererProps = {
  source: string;
};

export async function LegacyPageRenderer({ source }: LegacyPageRendererProps) {
  const { bodyClass, bodyHtml } = await loadLegacyHtml(source);

  return (
    <main className={bodyClass}>
      <GlobalRouteBar />
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </main>
  );
}
