//TODO:
//FIX ALL/ CHOOSE BETTER VARIABLE NAMES
// ADD TIME FILTER 
// add a search bar helper that will complete the search for you


 //used to get a user's text inputted into the search bar
 var searchString_global;
 var searchStringtemp;
 console.log("running program:");
// the user's text in the search bar is set to searchStringtemp and is constantly updated 
//upon each key press without them pressing the submit button
var searchBartextValues = document.getElementsByClassName('searchBartext');
for(var x = 0; x < searchBartextValues.length; x++) {
    searchBartextValues[x].addEventListener('keyup', (e) => {
        searchStringtemp = (e.target.value);
        // searchStringtemp value is passed to global variable for other functions to access the string
        searchString_global = searchStringtemp;
        console.log(searchString_global);
    });
}
// used in the API request to display the according "page" of movie search results
var pageNum = 1;

function loadMovies(){
    try{
        console.log("running loadMovies()");
        console.log(searchString_global);
        console.log("above is searchString_global in the loadMovies function");
        //request is sent to API as a general movie search, using the user's inputted string
        $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=e5794361' + '&page=' + pageNum).then(
            function(response){
            console.log(response);
            var totalNumpages = getTotalnumPages(response);
            console.log("totalNumpages:");
            console.log(totalNumpages);
            // function is called to then display the movies on the page
            displayMovies(response);
            generatePagebuttons(totalNumpages_global);
            });
            
    }
    
     catch(err) {
        console.error(err);
    }
};


// Function is called upon loading the movie Search page (movieSite.html)
//receives the user's movie Search made on the details page, re-assigns 
// searchString_global as the user's movie Search string, then calls loadMovies()
// function, thus displaying the user its search results without pressing the search button
function grandLoadmoviesNextsearch(){
    let nextMovieSearch = sessionStorage.getItem('nextMovieSearch');
    searchString_global = nextMovieSearch;
    loadMovies();
};

//the result from the API search request is passed in. The function then 
// loops through the entire array of objects using the map function. 
// HTML is dynamically generated onto the "movie" class list, where the 
// Movie object's Title and Poster are displayed
// If no poster image is available, a default image is displayed

// upon clicking the movie's Title, the function loadDetails is called and 
// the user is taken to a site where the details of the movie is displayed
const displayMovies = (response) => {
    const htmlString = response.Search.map((movie) => {
            return `
            <li class="movie">
                <h2 class="movieTitlebutton"><a onclick="loadDetails('${movie.Title}')"
                href="movieDetails.html">${movie.Title}</a></h2>
                <img src= ${movie.Poster} onerror="if(this.src != 'No-Image-Available2.jpeg') this.src = 'No-Image-Available2.jpeg';" >
                </img>
            </li>`;
        })
        .join('');
    moviesList.innerHTML = htmlString;
};


// gets the total number of pages that are going to be displayed for the user to choose
var totalNumpages_global = 1;
function getTotalnumPages(response){
    var totalNumresults = response.totalResults;
    var totalNumpages = Math.ceil(totalNumresults / 10);
    totalNumpages_global = totalNumpages;
    return totalNumpages;
}


//generates the pagination buttons that the user sees on the movieSite page
function generatePagebuttons(totalNumpages_global) {
    var wrapper = document.getElementById('pagination-wrapper');
    wrapper.innerHTML = '';
    // each button is given a different value in the ascending order that it is generated in
    for (var page = 1; page <= totalNumpages_global; page++) {
        wrapper.innerHTML += `<button type="button" value=${page} class="page-buttons">${page}</button>`
    }
}

//when a paigination button is clicked, pageNum's value is updated with the 
//pagination button's value. AN API request is sent with the updated pageNum in
//the loadMovies() function, giving 10 more search results to the user
$(document).on( 'click', '.page-buttons', function () {
    pageNum = $(this).val();
    console.log("totalNumpages_global after click:" + pageNum);
    loadMovies();
})


// the movie title that has been clicked on by the user is stored in the user's sessionStorage in the 
//movieDetails page, where the movieTitle will be retreieved in the displayMoviedetails() function 
// upon loading the page displaying the movie details
function loadDetails(movieTitle){
        sessionStorage.setItem('movieTitle',movieTitle);
        window.location = 'movieDetails.html';
        return false;
    
};
// stores the user's search to Session Storage to the page displaying all movies (movieSite.html)
// Used while making a search on the movie Details page
function loadNextsearchHelper(nextMovieSearch){
    sessionStorage.setItem('nextMovieSearch',nextMovieSearch);
    window.location = 'movieSite.html';
    return false;
}


function displayMoviedetails() {
    // movieTitle that was clicked on in the previous page showing 10 results is retreieved 
    // on the movie details page
    let movieTitle = sessionStorage.getItem('movieTitle');
    // API movie TITLE request is sent using the movieTitle variable that was retreived above 
    $.getJSON('https://www.omdbapi.com/?t=' + movieTitle + '&apikey=e5794361').then(function(response){
        console.log(response);
    // HTML is dynamically generated onto details page as the singular object (response), which is the 
    // movie, is used to display its instances
    let htmlStringdetails =
    `<div class="row">
    <div class="col-md-4">
    <img src= ${response.Poster} onerror="if(this.src != 'No-Image-Available2.jpeg') this.src = 'No-Image-Available2.jpeg';" >
    </img>
    
        <div class="col-md-8">
        <h1> ${response.Title}</h1>
        <li class="movieDetails">
        <p> <strong>Release Date:</strong> ${response.Released} </p>
        <p> <strong>Director:</strong> ${response.Director} </p>
        <p> <strong>Genre:</strong> ${response.Genre} </p>
        <p> <strong>Runtime:</strong> ${response.Runtime} </p>
        <p> <strong>Plot:</strong> ${response.Plot} </p>
    </li>
        </div>
        </div>
        </div>`;
        // HTML is written onto the movieDetails un-ordered list
         movieDetails.innerHTML = htmlStringdetails;
    });
};


// upon cicking the search Button while doing a user search, loadMovies() is called,
// displaying 10 movies at a time receieved from the search
// var buttonReference = document.getElementById('searchButton');
//         buttonReference.onclick = function() {
//             loadMovies();
//     }


    
