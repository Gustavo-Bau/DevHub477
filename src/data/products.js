export const products=[
{slug:'cloudscale-pro',name:'CloudScale Pro',description:'Gestão em nuvem com monitoramento e automação.',vendor:'DevHub Labs',category:'SaaS e Nuvem',platform:'Web',rating:4.9,price:299,createdAt:'2026-01-10',popularity:98,features:['Dashboard unificado','Alertas inteligentes','Conectores SaaS']},
{slug:'api-gateway',name:'API Gateway Pro',description:'Controle e segurança para APIs modernas.',vendor:'Gateway Studio',category:'Ferramentas Dev',platform:'Web',rating:4.7,price:149,createdAt:'2026-03-01',popularity:90,features:['Rate limiting','Auth JWT','Relatórios']},
{slug:'secure-watch',name:'Secure Watch',description:'Monitoramento de segurança e compliance.',vendor:'SafeOps',category:'Segurança',platform:'Web',rating:4.8,price:199,createdAt:'2026-04-15',popularity:85,features:['Alertas SOC','Compliance','Auditoria']}
];
export const categories=[...new Set(products.map(p=>p.category))];
export const platforms=[...new Set(products.map(p=>p.platform))];
