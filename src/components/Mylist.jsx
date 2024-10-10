import { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { deleteMovies, setWatchList } from '../stores/movieSlice';
import { Card, Button } from "react-bootstrap";
import { MdPlaylistRemove } from "react-icons/md";
import { getWatchList } from "../helper";

const Mylist = (props) => {

    const { changeColor, user } = props

    const navigate = useNavigate()

    const [movies,setMovies] = useState([])

    const watchlist = useSelector((state) => state.movies.watchlist);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate])

    const dispatch = useDispatch();

    useEffect(() => {
        const watchlist = getWatchList(user.email)
        setWatchList(watchlist)
        setMovies(watchlist)
        console.log(watchlist,user.email)
    },[user.email, dispatch, watchlist])

    return (
        <div className="container mt-4 my-4">
            {movies.length > 0 ? (
                <div>
                    <div className="row">
                        <h1>My Watchlist - {movies.length}</h1>
                        {movies.map((ele, i) => {
                            return (
                                <div className="col-3 my-4" key={i}>
                                    <Card>
                                        <Link to={`/moviedetails/${ele.imdbID}`}>
                                            <Card.Img variant="top" src={ele.Poster} />
                                        </Link>
                                        <Card.Body>
                                            <Card.Title>{ele.Title}</Card.Title>
                                            <Card.Text>({ele.Year})</Card.Text>
                                            <Button
                                                variant={changeColor ? "primary text-white" : "danger text-white"}
                                                onClick={() => dispatch(deleteMovies({ email: user.email, imdbID: ele.imdbID }))}
                                            >
                                                <MdPlaylistRemove size={24} /> Remove from watchlist
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4">No movies added to the watchlist yet.</p>
            )}
        </div>
    );
};

export default Mylist;
