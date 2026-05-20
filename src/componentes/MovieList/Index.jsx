import { useEffect, useState } from 'react'
import './MovieList.css'
import MovieCard from '../MovieCard/Index'

const MovieList = ({ movies = [], onMovieSelect, onToggleFavorito, esFavorito }) => {
  const [filteredMovies, setFilteredMovies] = useState(movies)

  useEffect(() => {
    setFilteredMovies(movies)
  }, [movies])

  if (!filteredMovies.length) {
    return <div className="movie-list-empty">No hay resultados para mostrar.</div>
  }

  return (
    <div className="movie-list">
      {filteredMovies.map((movie) => (
        <MovieCard
          key={movie.imdbID || movie.id || movie.Title}
          movie={movie}
          onClick={() => onMovieSelect?.(movie)}
          favorito={esFavorito?.(movie.imdbID)}
          onToggleFavorito={() => onToggleFavorito?.(movie)}
        />
      ))}
    </div>
  )
}

export default MovieList;