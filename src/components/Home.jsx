import { useState,useEffect } from "react"
import axios from "axios"
import {useSelector,useDispatch} from 'react-redux'
import { getMovies,addMovies,setWatchList } from "../stores/movieSlice"
import Swal from "sweetalert2"
import { getWatchList } from "../helper";

import Movies from "./Movies"

import { Card,Container,Form,Button,Row,Col } from "react-bootstrap"

const Home = (props) => {

    const {loggedin,loading,isLoading,changeColor,user} = props

    const dispatch = useDispatch()

    const [search,setSearch] = useState("")

    const movies = useSelector((state) => {
        return state.movies.data
    })

    useEffect(() => {
        if (user && user.email) {
            const storedWatchlist = getWatchList(user.email);
            dispatch(setWatchList(storedWatchlist));
        }
    }, [user, dispatch]);

    const handleLoader = () => {
        dispatch(isLoading(!loading))
    }

    const handleChange = (e) => {
        setSearch(e.target.value)
    }

    const searchMovies = (e) => {

        e.preventDefault()
        
        axios.get(`https://www.omdbapi.com/?s=${search}&apikey=d58c0fc`)
        .then((response) => {
            const result = response.data.Search
            dispatch(getMovies(result))
            handleLoader()
            console.log(result)
        })
        .catch((err) => {
            if(err.status === 404 ){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong! please try again later",
                  });
            }else{
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: "Please enter a valid movie",
                    showConfirmButton: false,
                    timer: 1500
                  });
            }
        })

    }

    const addToWatchList = (movie) => {
            dispatch(addMovies({email: user.email,movie}))
    }

    return(
        <div className="container mt-4">
            <Card border={changeColor ? 'primary' : 'danger'}>
                <Container className="mt-3 mb-3">
                    <h1>Welcome To <font className={changeColor ? 'text-primary' : 'text-danger'}>WatchLists</font></h1>
                    <p>Browse movies, add them to playlists and share them with friends</p>
                    <p>Just click the  <Button variant={changeColor ? "primary text-white" : "danger text-white"} >Add to Watchlist</Button> button after searching to add a movie, the poster to see more details</p>
                </Container>
            </Card>
            <br />
            <Form onSubmit={searchMovies}>
                <Row className="align-items-center gx-0">
                    <Col xs={11}>
                        <Form.Control size="sm" type="text" name="" id="" value={search} onChange={handleChange} placeholder="Search" />
                    </Col>
                    <Col>
                        <Button type="submit" variant={changeColor ? 'primary text-white' : 'danger text-white'} className="w=100" size="sm" >Search</Button>
                    </Col>
                </Row>
            </Form>
            <Movies search={search} movies={movies} loggedin={loggedin} addToWatchList={addToWatchList} loading={loading} changeColor={changeColor} user={user} />
        </div>
    )
}

export default Home