export default function LoadingState({ message = 'Carregando catálogo do marketplace...' }) {
  return (
    <section className='loading-state'>
      <div className='card'>
        <p className='muted'>{message}</p>
        <div className='loading-skeleton-grid'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='loading-skeleton-card'>
              <div className='skeleton skeleton-image' />
              <div className='skeleton skeleton-title' />
              <div className='skeleton skeleton-line' />
              <div className='skeleton skeleton-line short' />
              <div className='skeleton skeleton-button' />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
