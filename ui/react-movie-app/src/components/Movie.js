import React from 'react'

const DEFAULT_PLACEHOLDER_IMAGE = "https://ege.edu.tr/images/logo1.png";

const  Movie = ({movie}) => {
  const poster = DEFAULT_PLACEHOLDER_IMAGE ;

  return (
    <div className="movie">
      <p>{`Film Adı: ${movie.title} Önerme oranı: ${movie[0]}`}</p>
      <div>
      <img
          width="200"
          alt={`The movie titled: ${movie.title}`}
          src={poster}
        />
      </div>
    </div>
  )
}

export default Movie
