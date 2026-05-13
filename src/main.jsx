import React from 'react';import ReactDOM from 'react-dom/client';import { BrowserRouter,useRoutes } from 'react-router-dom';import { routes } from './routes';import './styles/global.css';
const App=()=>useRoutes(routes);
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
