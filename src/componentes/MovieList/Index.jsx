import { useEffect, useState } from "react";
import MovieCard from "../MovieCard/Index";

const MovieList = ({ movies = [], onMovieSelect }) => {
    const [filteredMovies, setFilteredMovies] = useState(movies);
    useEffect(() => {
        setFilteredMovies(movies);
    }, [movies]);

    return (
        <div className="movie-list">
            {filteredMovies.length === 0 ? (
                <p>No hay resultados para mostrar.</p>
            ) : (
                filteredMovies.map((movie) => (
                    <MovieCard
                        key={movie.imdbID || movie.id || movie.Title}
                        movie={movie}
                        onClick={() => onMovieSelect?.(movie)}
                    />
                ))
            )}
        </div>
    );
};

export default MovieList;