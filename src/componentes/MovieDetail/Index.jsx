import './MovieDetail.css'

const MovieDetail = ({ movie }) => {
  const poster =
    movie?.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://via.placeholder.com/320x480?text=Sin+imagen'

  return (
    <article className="movie-detail-card">
      <div className="movie-detail-poster">
        <img src={poster} alt={movie?.Title || 'Portada no disponible'} />
      </div>
      <div className="movie-detail-content">
        <h2>{movie?.Title || 'Título no disponible'}</h2>
        <p className="detail-line"><strong>Año:</strong> {movie?.Year || 'N/A'}</p>
        <p className="detail-line"><strong>Género:</strong> {movie?.Genre || 'N/A'}</p>
        <p className="detail-line"><strong>Director:</strong> {movie?.Director || 'N/A'}</p>
        <p className="detail-line"><strong>Actores:</strong> {movie?.Actors || 'N/A'}</p>
        <p className="detail-line"><strong>Sinopsis:</strong> {movie?.Plot || 'N/A'}</p>
        <p className="detail-line"><strong>Duración:</strong> {movie?.Runtime || 'N/A'}</p>
        <p className="detail-line"><strong>Idioma:</strong> {movie?.Language || 'N/A'}</p>
        <p className="detail-line"><strong>País:</strong> {movie?.Country || 'N/A'}</p>
        <p className="detail-line"><strong>IMDb:</strong> {movie?.imdbRating || 'N/A'}</p>
      </div>
    </article>
  )
}

export default MovieDetail;