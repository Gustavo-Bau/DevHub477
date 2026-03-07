# DevHub477 Web (Next.js + App Router)

Projeto organizado para publicação no GitHub e deploy direto na Vercel, usando as telas HTML originais como base de cada rota.

## ✅ O que foi feito

- Estrutura profissional com **Next.js 14 + TypeScript**.
- Rotas do App Router mapeadas para as telas originais.
- Arquivos HTML originais preservados em `pages/` (sem perda de conteúdo).
- Componente reutilizável para renderização das páginas legadas.
- Componente global de navegação entre rotas.
- Assets organizados em `public/assets`.
- `.gitignore` pronto para versionamento.

## Estrutura

```bash
.
├── app/                             # Rotas do projeto (Next.js App Router)
├── components/                      # Componentes reutilizáveis
├── lib/                             # Utilitários (loader de HTML legado)
├── pages/                           # HTMLs originais preservados
├── public/assets/                   # Assets estáticos
├── package.json
├── tsconfig.json
└── README.md
```

## Rotas disponíveis

- `/` → redireciona para `/login` (padrão: Login Pessoa Física)
- `/login`
- `/create-account`
- `/create-account-comprehensive`
- `/dashboard`
- `/marketplace`
- `/product/cloudscale-pro`
- `/checkout`
- `/order-confirmation`
- `/billing/invoices`
- `/settings/profile`
- `/settings/security`
- `/settings/notifications`
- `/subscriptions/cloudscale-pro`

## Como rodar localmente

### 1) Instalar dependências

```bash
npm install
```

### 2) Subir em modo desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 3) Build de produção

```bash
npm run build
npm start
```

## Deploy na Vercel

Este projeto já está pronto para Vercel.

1. Suba no GitHub.
2. Importe o repositório na Vercel.
3. Framework detectado automaticamente: **Next.js**.
4. Build command: `next build` (padrão).
5. Output: padrão do Next.js.

## Observações técnicas

- As telas originais foram mantidas e carregadas dinamicamente por rota.
- O layout visual foi preservado com Tailwind CDN + configuração global.
- A barra superior de navegação global facilita validação e navegação entre páginas.
