import React from 'react'

const DEFAULT_PLACEHOLDER_IMAGE = "https://lh3.googleusercontent.com/proxy/IeQ6h3U3Mii2qfe8hbhTQvXTg3n9PlwxvPBigWMQ0MhamMLEmx10pknAV_pkmvbD96Mz1PLf8kJC3Yo5dQQDMxjMP7krEdemTJatkfHSXNErv_8eZTiYZNLV2UxIePmdmNIqirHW7oLwqCpOVQx3NfeJv7l8lAeDdZstb_07M4hMsYXYOqn0X97EVtqtv7YzUbIvzJ5s-UTAOn_zW6pxFqI";

const  Movie = ({movie}) => {
  const poster = DEFAULT_PLACEHOLDER_IMAGE ;

  return (
    <div className="movie">
      <p>{movie.Title}</p>
      <div>
      <img
          width="200"
          alt={`The movie titled: ${movie.Title}`}
          src={poster}
        />
      </div>
    </div>
  )
}

export default Movie
