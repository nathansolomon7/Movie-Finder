//MUST DO BY TOMORROW THE 9TH:
//ADD PAIGINATION
// FIGURE OUT HOW TO GET MORE THAN 10 RESULTS
// MUST HANDLE NOT HAVING AN EMPTY FIELD FOR THE TEXT FIELDS LIKE GENRE AND DIRECTOR 
// ADD TIME FILTER 
// COMMENT OUT CODE
// ALLOW ENTER KEY USE UPON MAKING A SEARCH BY CHANGING THE BUTTON TO A FORM (IF POSSIBLE)

//THINGS YOU CAN WAIT ON FOR OFFICE HOURS:
//ASK IF ITS OK TO NOT BE ABLE TO GO BACK TO MOST RECENT SEARCHES SINCE I DONT GENERATE A NEW PAGE EACH TIME OR HOW TO FIX IT



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
        console.log(searchStringtemp);
    });
}

function loadMovies(){
    try{
        console.log("running loadMovies()");
        // loadNextsearchHelper(searchString_global);
        // var buttonReference_searchBartext = document.getElementsByClassName('searchBartext');
        //     for(var x = 0; x < buttonReference_searchBartext.length; x++){
        //          searchStringtemp = buttonReference_searchBartext[x].value;
        //     }
        console.log(searchString_global);
        console.log("above is searchString_global in the loadMovies function");
        //request is sent to API as a general movie search, using the user's inputted string
        $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=e5794361').then(function(response){
            console.log(response);
            // function is called to then display the movies on the page
            displayMovies(response);
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
                <img src= ${movie.Poster} onerror="if(this.src != 'no-image-available.jpeg') this.src = 'no-image-available.jpeg';" >
                </img>
            </li>
        `;
        })
        .join('');
    moviesList.innerHTML = htmlString;
};
/////////////////////////used for when movie title details///////////////////////////////////

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

//////////////////////////////////////////////////////////////////////

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
    <img src= ${response.Poster} alt = "images/no-image-available.jpeg" >
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

/////////////////// associating button clicks to calls //////////////////////////////////////////////////////
//

// upon cicking the search Button while doing a user search, loadMovies() is called,
// displaying 10 movies at a time receieved from the search
var buttonReference = document.getElementsByClassName('searchButton');
    for(var x = 0; x < buttonReference.length; x++){
        buttonReference[x].onclick = function() {
            loadMovies();
    }
}
