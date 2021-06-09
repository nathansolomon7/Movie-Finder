//MUST DO BY TOMORROW THE 9TH
//ADD PAIGINATION
// FIGURE OUT HOW TO GET MORE THAN 10 RESULTS
// MUST HANDLE NOT HAVING AN IMAGE OR EMPTY FIELD - test with Inception for image handling
// ADD TIME FILTER 
// COMMENT OUT CODE

//THINGS YOU CAN WAIT ON FOR OFFICE HOURS:
//FIGURING OUT HOW TO DELETE THE MOST RECENT INPUT IN SEARCH BAR TO NOT HAVE INACTIVE SEARCH BAR 
// FIX CSS FLEX BOX AND ADDRRESS ANY STYLING BUGS
 
 var searchString_global;
 var searchStringtemp;
 console.log("running:");
//////////////////////////////////////////////////////////////////////////////////////////

var searchBartextValues = document.getElementsByClassName('searchBartext');

for(var x = 0; x < searchBartextValues.length; x++) {
    searchBartextValues[x].addEventListener('keyup', (e) => {
        searchStringtemp = (e.target.value);
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
        $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=e5794361').then(function(response){
            console.log(response);
            displayMovies(response);
            });
    }
    
     catch(err) {
        console.error(err);
    }
};

function grandLoadmoviesNextsearch(){
    let nextMovieSearch = sessionStorage.getItem('nextMovieSearch');
    searchString_global = nextMovieSearch;
    loadMovies();
};


const displayMovies = (response) => {
    const htmlString = response.Search.map((movie) => {
            return `
            <li class="movie">
                <h2 class="movieTitlebutton"><a onclick="loadDetails('${movie.Title}')"
                href="movieDetails.html">${movie.Title}</a></h2>
                <img src= ${movie.Poster} alt = "images/no-image-available.jpeg" >
                </img>
            </li>
        `;
        })
        .join('');
    moviesList.innerHTML = htmlString;
};
/////////////////////////used for when movie title details///////////////////////////////////

function loadDetails(movieTitle){
        sessionStorage.setItem('movieTitle',movieTitle);
        window.location = 'movieDetails.html';
        return false;
    
};

function loadNextsearchHelper(nextMovieSearch){
    sessionStorage.setItem('nextMovieSearch',nextMovieSearch);
    window.location = 'movieSite.html';
    return false;
}

//////////////////////////////////////////////////////////////////////
function displayMoviedetails() {
    let movieTitle = sessionStorage.getItem('movieTitle');
    $.getJSON('https://www.omdbapi.com/?t=' + movieTitle + '&apikey=e5794361').then(function(response){
        console.log(response);
    let htmlStringdetails =
        `<li class="movieDetails">
        <img src= ${response.Poster} alt = "images/no-image-available.jpeg" >
        </img>
            <h1> ${response.Title}</h1>
            <p> Release Date: ${response.Released} </p>
            <p> Director: ${response.Director} </p>
            <p> Genre: ${response.Genre} </p>
            <p> Runtime: ${response.Runtime} </p>
            <p> Plot: ${response.Plot} </p>
        </li>`;
         movieDetails.innerHTML = htmlStringdetails;
    });
};

/////////////////// associating button clicks to calls //////////////////////////////////////////////////////
//
var buttonReference = document.getElementsByClassName('searchButton');
    for(var x = 0; x < buttonReference.length; x++){
        buttonReference[x].onclick = function() {
            loadMovies();
    }
}
