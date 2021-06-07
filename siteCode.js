// NEW PLAN: use the search option for the url to find the movie title, then use the 
// option to redirect the user to a new page where youll be redirected to a url that is search 
// by title, where the information will then be displayed to you
 console.log("hello");
 //this works but does not work when details page is loaded
 // var searchString_global;
 // searchBar.addEventListener('keyup', (e) => {
 //    const searchString = e.target.value;
 //    searchString_global = searchString;
 //    console.log(searchString_global);
 //    });
 var searchString_global;
//////////////////////////////////////////////////////////////////////////////////////////
function loadMovies(){
    try{
        const searchString = document.getElementById('searchBartext').value;
        searchString_global = searchString;
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
///////////////////GONNA MAKE DISPLAYMOVIEDETAILS TO LOOK LIKE DISPLAYMOVES. YOU NEED THE INNER.HTML///////////////////
//////////////////////////////////////////////////////////////////////
const htmlStringdetails = function displayMoviedetails(response) {
            return
            `<li class="movieDetails">
                <h1> ${response.Title}</h1>
                <p> ${response.Year} </p>
                <p> ${response.Director} </p>
                <p> ${response.Genre} </p>
                <img src= ${response.Poster} alt = "images/no-image-available.jpeg" >
                </img>
                
            </li>`;
        htmlStringdetails.join('');
    moviesDetails.innerHTML = htmlStringdetails;
};

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// associating button clicks to calls //////////////////////////////////////////////////////
//
var buttonReference = document.getElementById('searchButton');
buttonReference.onclick = function() {
    loadMovies();
}
//maybe instead of having this function run on the click of the movie title, make it run when the web page gets 
//accessed for simplicity of coding
//TWO ISSUES: 
//1. YOU NEED TO CHECK TO SEE IF RESPONSE.ETC ACTUALLY WORKS. YOU BETTED ON that
//2. FIGURE OUT WHY THE FUNCTION IS NOT BEING CALLED ON THE CLICK OF THE MOVIE TITLE BUTTON
//PERHAPS YOU SHOULD CHANGE IT SO THAT THE FUNCTION LOADS WHEN THE PAGE LOADS?
//THEORY: THE HTML IS BEING GENERATED ON THE PREVIOUS PAGE AND NOT THE DETAILS PAGE. 
//THIS MAYBE CAN BE FIXED IF YOU GET THE FUNCTION TO RUN WHEN PAGE IS CALLLED?
//BUT THEN HOW WILL THE HTML FILE HAVE ACCESS TO THE SEARCH_STRING GLOBAL?


// YOU ALSO NEED TO CHANGE THE API REQUEST SO THAT THE MOVIE.TITLE GETS CHECKED OUT IN THE 
//REQUEST RATHER THAN THE SEARCH STRING
 

// var onButtonclick = document.getElementsByClassName('movieTitlebutton');
// 
// onButtonclick.onclick = function() {
//     window.onload = function(){
//         console.log("details request has been registered");
//         loadDetails(searchString_global);
//     }
// }


//////////////////////////////////////////////////////////////////////////////////////////
