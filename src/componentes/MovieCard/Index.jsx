import "./MovieCard.css";

const MovieCard = ({ movie, onClick }) => {
    return (
        <article className="movie-card" onClick={onClick}>
            <img
                src={movie.Poster}
                alt={movie.Title}
                className="movie-card-poster"
            />
            <div className="movie-card-content">
                <h2 className="movie-card-title">{movie.Title}</h2>
                <p className="movie-card-year">Año: {movie.Year}</p>
                <p className="movie-card-type">Tipo: {movie.Type}</p>
            </div>
        </article>
    );
};

export default MovieCard;
