//TODO: FIX UP CSS STYLE HEAVILY
//GET SEARCH BAR WORKING FOR ALL PAGES BY CHANGING FROM ID TO class
//ADD PAIGINATION
// FIGURE OUT HOW TO GET MORE THAN 10 RESULTS


// ADD TIME FILTER 

 
 var searchString_global;
 var searchStringtemp;
 console.log("running:");
//////////////////////////////////////////////////////////////////////////////////////////
function loadMovies(){
    try{
        console.log("running loadMovies()");
        
        var buttonReference_searchBartext = document.getElementsByClassName('searchBartext');
            for(var x = 0; x < buttonReference_searchBartext.length; x++){
                 searchStringtemp = buttonReference_searchBartext[x].value;
            }
        searchString_global = searchStringtemp;
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
