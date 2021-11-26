import React from "react";
import './Movie.css'

//Movie.js 파일을 위와 같이 수정한다. year 속성이 추가
const Movie = ({title, genres, cover, summary, year, rating, likes})=>{
    return(
        <div className='movie-container'>
            <img src={cover} alt={title}></img>
            <h3>{title} ({year})</h3>
            <h4>{genres.join(" ")}</h4>
            {/* <p>{summary}</p> */}
            <h4>{rating} / ❤️ {likes ? likes : 0} </h4>
        </div>
    )
}
export default Movie;