export const getWatchList = (email) => {

    const storeWatchList = JSON.parse(localStorage.getItem('testlist')) || {}
    return storeWatchList[email] || []

}

export const setWatchList = (email, data) => {

    console.log(email,data)
    const storeWatchList = JSON.parse(localStorage.getItem('testlist')) || {}
    storeWatchList[email] = data
    localStorage.setItem('testlist', JSON.stringify(storeWatchList))

}

export const deleteWatchList = (email, imdbID) => {
    const storeWatchList = JSON.parse(localStorage.getItem('testlist')) || {};

    if (storeWatchList[email]) {
        // Filter the user's watchlist to remove the movie with the specified imdbID
        storeWatchList[email] = storeWatchList[email].filter(movie => movie.imdbID !== imdbID);

        // Update localStorage with the modified watchlist
        localStorage.setItem('testlist', JSON.stringify(storeWatchList));
    }
};


