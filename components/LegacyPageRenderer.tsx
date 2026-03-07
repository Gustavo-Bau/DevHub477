import { loadLegacyHtml } from '@/lib/html-loader';

type LegacyPageRendererProps = {
  source: string;
};

export async function LegacyPageRenderer({ source }: LegacyPageRendererProps) {
  const { bodyClass, bodyHtml } = await loadLegacyHtml(source);

  return (
    <main className={bodyClass}>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </main>
  );
}
