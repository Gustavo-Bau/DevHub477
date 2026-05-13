import { Navigate } from 'react-router-dom';import BaseLayout from './layouts/BaseLayout';import HomePage from './pages/HomePage';import MarketplacePage from './pages/MarketplacePage';import ProductPage from './pages/ProductPage';import GenericPage from './pages/GenericPage';
const wrap=(el)=><BaseLayout>{el}</BaseLayout>;
export const routes=[
{path:'/',element:wrap(<HomePage/>)},{path:'/mercado',element:wrap(<MarketplacePage/>)},{path:'/produto/:slug',element:wrap(<ProductPage/>)},{path:'/produto',element:wrap(<ProductPage/>)},
...['/login','/dashboard','/perfil','/seguranca','/notificacoes','/pedidos','/favoritos','/carrinho','/checkout','/confirmacao-pedido','/faturas','/assinaturas','/admin','/sobre','/contato','/termos','/privacidade','/categorias'].map(p=>({path:p,element:wrap(<GenericPage title={p.replace('/','').replaceAll('-',' ').toUpperCase()}/>) })),
{path:'/cadastro',element:wrap(<GenericPage title='Cadastro' description='Escolha o tipo de conta: comum, empresa ou fornecedor.'/>)},{path:'/cadastro/empresa',element:wrap(<GenericPage title='Cadastro Empresa'/>)},{path:'/cadastro/fornecedor',element:wrap(<GenericPage title='Cadastro Fornecedor'/>)},
{path:'/404',element:wrap(<GenericPage title='Página não encontrada'/>)},{path:'*',element:<Navigate to='/404' replace/>}
];
