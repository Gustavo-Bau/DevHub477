export default function EmptyState({ title = 'Sem dados disponíveis', message = 'Quando houver conteúdo, ele aparecerá aqui.', action }) {
  return (
    <section className='empty-state'>
      <div className='card'>
        <div className='empty-illustration'>
          <span>🛍️</span>
        </div>
        <div>
          <h2>{title}</h2>
          <p className='muted'>{message}</p>
          {action && <div className='empty-action'>{action}</div>}
        </div>
      </div>
    </section>
  );
}
