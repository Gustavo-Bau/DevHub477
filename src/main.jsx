import React from 'react';import ReactDOM from 'react-dom/client';import { BrowserRouter,useRoutes } from 'react-router-dom';import { HelmetProvider } from 'react-helmet-async';import { routes } from './routes';import { CartProvider } from './context/CartContext';import './styles/global.css';
const App=()=>useRoutes(routes);
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><HelmetProvider><CartProvider><BrowserRouter><App/></BrowserRouter></CartProvider></HelmetProvider></React.StrictMode>);
