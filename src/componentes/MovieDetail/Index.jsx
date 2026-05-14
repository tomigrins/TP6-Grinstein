import React from "react";

const MovieDetail = ({ movie }) => {
    return (
        <div className="movie-detail">
            <h1>{movie.Title}</h1>
            <img src={movie.Poster} alt={movie.Title} />
            <p>Año: {movie.Year}</p>
            <p>Género: {movie.Genre}</p>
            <p>Director: {movie.Director}</p>
            <p>Actores principales: {movie.Actors}</p>
            <p>Sinopsis: {movie.Plot}</p>
            <p>Duración: {movie.Runtime}</p>
            <p>Idioma: {movie.Language}</p>
            <p>País: {movie.Country}</p>
            <p>Puntaje IMDb: {movie.imdbRating}</p>
        </div>
    );
};

export default MovieDetail;