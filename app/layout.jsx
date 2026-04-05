import './globals.css';
import { Providers } from '@/app/providers';

export const metadata = {
  title: 'DevHub Web',
  description: 'Projeto web organizado com rotas baseadas nas telas HTML originais.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "tailwind.config={darkMode:'class',theme:{extend:{colors:{primary:'#6b26d9','background-light':'#f7f6f8','background-dark':'#171220'},fontFamily:{display:['Inter','sans-serif']},borderRadius:{DEFAULT:'0.25rem',lg:'0.5rem',xl:'0.75rem',full:'9999px'}}}}",
          }}
        />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
