import { createSlice } from "@reduxjs/toolkit";
import { setWatchList as updateLocalStorage, deleteWatchList as removeLocalStorage } from "../helper";

const movieSlice = createSlice({
    name: 'Movies',
    initialState: {
        loading: true,
        data: [],
        watchlist: []
    },
    reducers: {
        getMovies: (state, action) => {
            return { ...state, data: [...action.payload] }
        },
        addMovies: (state, action) => {
            console.log(action.payload)
            const isMovieInWatchList = state.watchlist.find((ele) => {
                return ele.imdbID === action.payload.movie.imdbID
            })
            if (!isMovieInWatchList) {
                const updatedWatchlist = [...state.watchlist, action.payload.movie];
                updateLocalStorage(action.payload.email, updatedWatchlist) // Sync with localStorage
                return { ...state, watchlist: updatedWatchlist };
            }
        },
        setWatchList: (state, action) => {
            return { ...state, watchlist: [...action.payload] }
        },
        deleteMovies: (state, action) => {
            console.log("Deleting movie:", action.payload); // Check what is being passed in payload
            
            // Filter out the movie based on imdbID from local state
            const updatedWatchlist = state.watchlist.filter(movie => movie.imdbID !== action.payload.imdbID);
            
            // Ensure that the helper function correctly removes the movie from localStorage
            removeLocalStorage(action.payload.email, action.payload.imdbID);

            // Return the updated state
            return { ...state, watchlist: updatedWatchlist };
        },

        isLoading: (state, action) => {
            return { ...state, loading: action.payload }
        }
    }
})

export const { getMovies, isLoading, addMovies, deleteMovies, setWatchList } = movieSlice.actions
export default movieSlice.reducer