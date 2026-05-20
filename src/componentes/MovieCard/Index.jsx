import './MovieCard.css'

const MovieCard = ({ movie, onClick, favorito, onToggleFavorito }) => {
  const poster =
    movie?.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://via.placeholder.com/260x380?text=Sin+imagen'

  return (
    <article className="movie-card" onClick={onClick}>
      <button
        type="button"
        className={`favorite-button ${favorito ? 'favorite-active' : ''}`}
        onClick={(event) => {
          event.stopPropagation()
          onToggleFavorito?.()
        }}
        aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {favorito ? '★' : '☆'}
      </button>
      <img src={poster} alt={movie?.Title || 'Portada no disponible'} className="movie-card-poster" />
      <div className="movie-card-content">
        <h2 className="movie-card-title">{movie?.Title || 'Título desconocido'}</h2>
        <p className="movie-card-info">Año: {movie?.Year || 'N/A'}</p>
        <p className="movie-card-info">Tipo: {movie?.Type || 'N/A'}</p>
      </div>
    </article>
  )
}

export default MovieCard;
