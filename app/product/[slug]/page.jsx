import Link from 'next/link';
import { notFound } from 'next/navigation';

const products = {
  'cloudscale-pro': {
    name: 'CloudScale Pro', vendor: 'NexaSystems Inc.', price: '$49/mo',
    description: 'Plataforma SaaS para escalar serviços cloud com observabilidade e APIs enterprise.',
    category: 'SaaS & Cloud', rating: 4.9, users: '12.5k', integrationTime: '1 dia',
    features: ['Provisionamento automático', 'Alertas em tempo real', 'API REST completa'],
    trialUrl: 'https://example.com/demo/cloudscale-pro'
  },
  'dataflow-engine': {
    name: 'DataFlow Engine', vendor: 'QuantaStream', price: '$199',
    description: 'Motor de processamento de dados para pipelines em tempo real com foco em performance.',
    category: 'Dev Tools', rating: 4.7, users: '8.2k', integrationTime: '2 dias',
    features: ['Pipeline visual', 'Conectores enterprise', 'Observabilidade nativa'],
    trialUrl: 'https://example.com/demo/dataflow-engine'
  },
  'sentinel-guard': {
    name: 'Sentinel Guard', vendor: 'CyberArmor Lab', price: '$29/mo',
    description: 'Solução de segurança com políticas automáticas, alertas e proteção de workloads.',
    category: 'Security', rating: 4.8, users: '25k', integrationTime: '3 horas',
    features: ['Monitoramento 24/7', 'Auditoria centralizada', 'Automação de resposta'],
    trialUrl: 'https://example.com/demo/sentinel-guard'
  },
  'insightx-analytics': {
    name: 'InsightX Analytics', vendor: 'MetricMaster', price: '$12/mo',
    description: 'Dashboard analítico para métricas de produto com insights e acompanhamento de KPIs.',
    category: 'Analytics', rating: 4.5, users: '5.4k', integrationTime: '30 minutos',
    features: ['Painéis em tempo real', 'Segmentação por coorte', 'Exportação CSV e API'],
    trialUrl: 'https://example.com/demo/insightx-analytics'
  },
  'devconsole-plus': {
    name: 'DevConsole Plus', vendor: 'OpenTools Foundation', price: 'Free',
    description: 'Console de desenvolvimento colaborativo para times técnicos e operações.',
    category: 'Dev Tools', rating: 5.0, users: '42k', integrationTime: '15 minutos',
    features: ['Edição colaborativa', 'Templates de projeto', 'Integração com Git'],
    trialUrl: 'https://example.com/demo/devconsole-plus'
  },
  'micromesh-api': {
    name: 'MicroMesh API', vendor: 'WebStack Solutions', price: '$89/mo',
    description: 'API mesh para arquiteturas de microserviços com roteamento e observabilidade.',
    category: 'SaaS & Cloud', rating: 4.6, users: '9.1k', integrationTime: '4 horas',
    features: ['Gateway unificado', 'Rate limiting', 'Tracing distribuído'],
    trialUrl: 'https://example.com/demo/micromesh-api'
  },
  'refactorai-tool': {
    name: 'RefactorAI Tool', vendor: 'DevHub Labs', price: '$15/mo',
    description: 'Assistente de IA para refatoração de código legado com recomendações automáticas.',
    category: 'Dev Tools', rating: 4.4, users: '3.2k', integrationTime: '20 minutos',
    features: ['Sugestões assistidas por IA', 'Checklist de qualidade', 'Relatórios de dívida técnica'],
    trialUrl: 'https://example.com/demo/refactorai-tool'
  },
  'edgecache-cdn': {
    name: 'EdgeCache CDN', vendor: 'DevHub Infra', price: 'Free Tier',
    description: 'CDN global para entrega de assets com baixa latência e cache inteligente.',
    category: 'SaaS & Cloud', rating: 4.3, users: '18k', integrationTime: '45 minutos',
    features: ['Cache por região', 'Rules engine', 'Analytics de tráfego'],
    trialUrl: 'https://example.com/demo/edgecache-cdn'
  }
};

export default function ProductDetailPage({ params }) {
  const product = products[params.slug];
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <section className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Product Detail</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm text-slate-600">por {product.vendor} • {product.category}</p>
          </div>
          <span className="rounded-xl bg-primary/10 px-4 py-2 text-lg font-bold text-primary">{product.price}</span>
        </div>

        <p className="mt-5 text-slate-700">{product.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Avaliação</p><p className="text-xl font-black text-slate-900">⭐ {product.rating}</p></article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Usuários ativos</p><p className="text-xl font-black text-slate-900">{product.users}</p></article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Tempo de integração</p><p className="text-xl font-black text-slate-900">{product.integrationTime}</p></article>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-xl font-black text-slate-900">Recursos principais</h2>
            <ul className="mt-3 grid gap-2">
              {product.features.map((feature) => (
                <li key={feature} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">• {feature}</li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-bold text-slate-900">Teste no site (demo embutida)</h3>
              <p className="mt-1 text-sm text-slate-600">Use a prévia abaixo para testar o software sem sair da plataforma.</p>
              <iframe
                title={`Demo de ${product.name}`}
                src={product.trialUrl}
                className="mt-4 h-72 w-full rounded-lg border border-slate-200 bg-white"
                loading="lazy"
              />
              <p className="mt-2 text-xs text-slate-500">Se a demo externa bloquear iframe, use o botão “Abrir demo completa”.</p>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-lg font-black text-slate-900">Ações</h3>
            <div className="mt-4 grid gap-2">
              <Link href="/checkout" className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white">Testar agora</Link>
              <Link href={product.trialUrl} className="rounded-lg border border-primary/40 px-4 py-2 text-center text-sm font-semibold text-primary">Abrir demo completa</Link>
              <Link href="/support" className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700">Falar com especialista</Link>
              <Link href="/marketplace" className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700">Voltar ao marketplace</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
