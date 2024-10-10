import { useState,useEffect } from "react"
import { useParams,Link } from "react-router-dom"
import axios from "axios"

import {useDispatch,useSelector} from 'react-redux'
import { addMovies,deleteMovies,setWatchList } from "../stores/movieSlice"

import { Container,Row,Col,Button,Card,Badge } from "react-bootstrap"

import { MdPlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";

import { getWatchList } from "../helper"

import Loader from "./Loader"

const MovieDetails = (props) => {

    const {loggedin,loading,isLoading,changeColor,user} = props

    const {id} = useParams()

    const dispatch = useDispatch()

    const [movie,setMovie] = useState({})

    useEffect(()=>{
        axios.get(`https://www.omdbapi.com/?i=${id}&apikey=d58c0fc`)
        .then((response)=>{
            const result = response.data
            setMovie(result)
            dispatch(isLoading(false))
        })
        .catch((err)=>{
            alert(err.message)
        })
    })

    useEffect(() => {
      if (user && user.email) {
          const storedWatchlist = getWatchList(user.email);
          dispatch(setWatchList(storedWatchlist));
      }
  }, [user, dispatch]);

    const watchlist = useSelector((state) => state.movies.watchlist);

  const isInWatchlist = (imdbID) => {
    return watchlist.some((movie) => movie.imdbID === imdbID);
  };

    const handleToggleWatchlist = (movie) => {
      if (isInWatchlist(movie.imdbID)) {
        dispatch(deleteMovies({email: user.email,imdbID: movie.imdbID})); 
      } else {
        dispatch(addMovies({email:user.email,movie})); 
      }
    };

    return(
        <div>
            <Container className="mt-4">
              {loading ? ( <Loader changeColor={changeColor} /> ) : (
            <Row>
            <Col md={4}>
            <Card>
                <Card.Img src={movie.Poster} alt={movie.Title} />
            </Card>
            </Col>
            <Col md={8}>
              <h1>
                  {movie.Title} <Badge bg="warning text-dark">{movie.imdbRating} ★</Badge>
              </h1> 
              <h5 className="text-muted">{movie.Year} | {movie.Runtime} | {movie.Rated}</h5>

              <hr className="bg-light" />

              <h5 className="text-dark">Overview</h5>
              <p className="text-dark">{movie.Plot}</p>

              <Row className="text-dark">
                <Col md={6}>
                  <h6>Starring</h6>
                  <p>{movie.Actors}</p>
                </Col>
                <Col md={6}>
                  <h6>Genre</h6>
                  <p>{movie.Genre}</p>
                </Col>
              </Row>

              <Row className="text-dark">
                <Col md={6}>
                  <h6>Director</h6>
                  <p>{movie.Director}</p>
                </Col>
                <Col md={6}>
                  <h6>Writer</h6>
                  <p>{movie.Writer}</p>
                </Col>
              </Row>
              {movie.Ratings?.length > 0 && (
              <div className="mt-2">
                <h3 className="text-dark">Other Ratings:</h3>
                <ul>
                  {movie.Ratings.map((ele, i) => (
                    <li key={i} className="text-dark">
                      {ele.Source}: {ele.Value}
                    </li>
                  ))}
                </ul>
              </div>
              )}
              {!loggedin ? (
                 <Button as={Link} to="/login" variant={changeColor ? "primary text-white" :"danger text-white"} >Login to add movie</Button> 
              ) : (
                <Button variant={changeColor ? "primary text-white" :"danger text-white"} onClick={() => handleToggleWatchlist(movie)}>
                {isInWatchlist(movie.imdbID) ? (<><MdPlaylistAddCheck size={24} /> Added to Watchlist</>) : (<><MdPlaylistAdd size={24} /> Add to Watchlist</>)}
              </Button>
              )}
    
            </Col>
            </Row>

          )}
                
            </Container>
        </div>
    )
}

export default MovieDetails
