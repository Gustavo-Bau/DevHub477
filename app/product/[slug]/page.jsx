import Link from 'next/link';
import { notFound } from 'next/navigation';

const products = {
  'cloudscale-pro': {
    name: 'CloudScale Pro',
    vendor: 'NexaSystems Inc.',
    price: '$49/mo',
    description: 'Plataforma SaaS para escalar serviços cloud com observabilidade e APIs enterprise.'
  },
  'dataflow-engine': {
    name: 'DataFlow Engine',
    vendor: 'QuantaStream',
    price: '$199',
    description: 'Motor de processamento de dados para pipelines em tempo real com foco em performance.'
  },
  'sentinel-guard': {
    name: 'Sentinel Guard',
    vendor: 'CyberArmor Lab',
    price: '$29/mo',
    description: 'Solução de segurança com políticas automáticas, alertas e proteção de workloads.'
  },
  'insightx-analytics': {
    name: 'InsightX Analytics',
    vendor: 'MetricMaster',
    price: '$12/mo',
    description: 'Dashboard analítico para métricas de produto com insights e acompanhamento de KPIs.'
  },
  'devconsole-plus': {
    name: 'DevConsole Plus',
    vendor: 'OpenTools Foundation',
    price: 'Free',
    description: 'Console de desenvolvimento colaborativo para times técnicos e operações.'
  },
  'micromesh-api': {
    name: 'MicroMesh API',
    vendor: 'WebStack Solutions',
    price: '$89/mo',
    description: 'API mesh para arquiteturas de microserviços com roteamento e observabilidade.'
  },
  'refactorai-tool': {
    name: 'RefactorAI Tool',
    vendor: 'DevHub Labs',
    price: '$15/mo',
    description: 'Assistente de IA para refatoração de código legado com recomendações automáticas.'
  },
  'edgecache-cdn': {
    name: 'EdgeCache CDN',
    vendor: 'DevHub Infra',
    price: 'Free Tier',
    description: 'CDN global para entrega de assets com baixa latência e cache inteligente.'
  }
};

export default function ProductDetailPage({ params }) {
  const product = products[params.slug];

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Product Detail</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">{product.name}</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">by {product.vendor}</p>
        <p className="mt-6 text-slate-700">{product.description}</p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary/5 p-4">
          <span className="text-lg font-bold text-primary">{product.price}</span>
          <div className="flex gap-3">
            <Link href="/checkout" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
              Continuar para checkout
            </Link>
            <Link
              href="/marketplace"
              className="rounded-lg border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary"
            >
              Voltar ao marketplace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
