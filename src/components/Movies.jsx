import { Link,useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addMovies, deleteMovies } from "../stores/movieSlice";

import { MdPlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";

const Movies = (props) => {
  const { movies,loggedin,changeColor,user } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate()
 
  const watchlist = useSelector((state) => state.movies.watchlist);

  const isInWatchlist = (imdbID) => {
    console.log(watchlist,imdbID)
    return watchlist.some((ele) => {
      return ele.imdbID === imdbID
    });
  };

  const handleToggleWatchlist = (movie) => {
      if (isInWatchlist(movie.imdbID)) {
        dispatch(deleteMovies({ email: user.email, imdbID: movie.imdbID })); 
      } else {
        dispatch(addMovies({email:user.email,movie})); 
      }
  };

  return (
    <div className="container mt-4 my-4">
      <div className="row">
        {movies.map((ele, i) => (
          <div className="col-3 my-4" key={i}>
            <Card>
              <Link to={`/moviedetails/${ele.imdbID}`}>
                <Card.Img variant="top" src={ele.Poster} />
              </Link>
              <Card.Body>
                <Card.Title>{ele.Title}</Card.Title>
                <Card.Text>({ele.Year})</Card.Text>
                {!loggedin ? (
                  <Button
                  variant={changeColor ? "primary text-white" :"danger text-white"}
                  as={Link}
                  to="/login"
                >
                  Log in to add movies
                </Button>
                ) : (
                  <Button
                  variant={changeColor ? "primary text-white" :"danger text-white"}
                  onClick={() => handleToggleWatchlist(ele)}
                >
                  {isInWatchlist(ele.imdbID) ? (<><MdPlaylistAddCheck size={24} /> Added to Watchlist</>) : (<><MdPlaylistAdd size={24} /> Add to Watchlist</>)}
                </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
