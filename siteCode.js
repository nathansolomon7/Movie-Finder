//TODO:


// FIGURE OUT HOW WHEN THE USER TAKES AWAY THEIR MAX YEAR BY BACKSPACE IT REVERTS BACK 
// TO ORIGINAL SEARCH. PERHAPS WHEN THAT VALUE GETS SUBTRACTED BY 1000 LOAD GRANDSEARCH

// add a search bar helper that will complete the search for you
// FIGURE OUT A WAY TO HANDLE NO SEARCHES FOUND THAT STOPS THE PROGRAM FROM RUNNING AND CRASHING
//GET RID OF THE EVENT HANDLED SEARCH REGISTER.
// ACKNOWLADGE THE ISSUE THAT AFTER GOING BACK TO A PREVIOUS SEARCH PAGE, YOU
// CAN NOT JUST PRESS ENTER. TEST TO SEE IF CASE WITH OTHER VERSION


 //used to get a user's text inputted into the search bar
 var searchString_global;
 var searchStringtemp;
 var isBackPagepressed = false;
 var maxYearparam_global;
 var minYearparam_global;
 var isFilteredSearch = false;
 var timeFilteredResponse_global;
 var isShowMoreclicked = false;
 var isPaganationremoved = false;
 var isShowmoreButtonremoved = false;
 var isnoResultsFoundfiltered = false;
 var isgetRidofFilterSearch = false;
 // used in the API request to display the according "page" of movie search results
 var pageNum = 1;
 
 console.log("running program:");
 console.log("searchString_global:" + searchString_global);
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


function loadMovies(){
    try{
        console.log("running loadMovies()");
        console.log(searchString_global);
        console.log("above is searchString_global in the loadMovies function");
        //request is sent to API as a general movie search, using the user's inputted string
         // setMoviesearchStorage(searchString_global);
        $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + pageNum).then(
            function(response){
            console.log(response);
            if(response.Error == "Movie not found!"){
                displayNumresults(0);
                displayNoresultsFound();
                clearElement("#moviesList");
                clearElement("#pagination-wrapper");
                clearElement("#showMorebutton");
                clearElement("#containerTimeFilter");
                return;
            }
            var totalNumpages = getTotalnumPages(response);
            displayNumresults(totalNumresults_global);
            
            if ((isFilteredSearch == true) && (maxYearparam_global > 999)){
                console.log("isFilteredSearch andMaxYearparam is true");
                 filterResponsebyYear(response.Search);
                console.log("timeFilteredResponse_global:");
                console.log(timeFilteredResponse_global);
                var filteredNumresults = timeFilteredResponse_global.length;
                displayNumresults(filteredNumresults)
                response = timeFilteredResponse_global;
                displayMoviesFiltered(response);
            }
            
            console.log("totalNumpages:");
            console.log(totalNumpages);
            if(isnoResultsFoundfiltered == true){
                displayNoresultsFound();
                clearElement("#pagination-wrapper");
                clearElement("#showMorebutton");
                 
            }
            // function is called to then display the movies on the page
            if(isFilteredSearch == false && isnoResultsFoundfiltered == false){
                clearElement("#noResultsFoundtext");
                clearElement("#pagination-wrapper");
                clearElement("#showMorebutton");
                displayMovies(response);
            }
            
            if (isFilteredSearch == false && isnoResultsFoundfiltered == false){
                if(isgetRidofFilterSearch == false){
                    displayTimeFilter();
                }
            
                createShowMoreButton();
                generatePagebuttons(totalNumpages_global);
            }
            
            isFilteredSearch = false;
            isnoResultsFoundfiltered = false;
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
function loadNextsearchDetailspage(){
    isnoResultsFoundfiltered = false;
    //the movie search that the user typed in the search bar on the details page
    var nextMovieSearch = sessionStorage.getItem('nextMovieSearch');
    console.log("nextMovieSearch: " + nextMovieSearch);
    console.log("is nextMovieSearch undefined:" + (nextMovieSearch == "undefined"));
    
    
    if(nextMovieSearch == "undefined"){
        var previousSearch = sessionStorage.getItem('currentMoviesearchTemp');
        console.log("previousSearch:" + previousSearch)
        searchString_global = previousSearch;
    }
    else{
        searchString_global = nextMovieSearch;
    }
        //FIGURE OUT WHY NOT WORKING
        
        console.log("searchString_global value at end of grandLoad function:" + searchString_global);
    
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
            <li class="movie" <a onclick="loadDetails('${movie.Title}',searchString_global)"
            href="movieDetails.html"></a>
                <h2 class="movieTitlebutton">${movie.Title}</h2>
                <img src= ${movie.Poster} onerror="if(this.src != 'No-Image-Available2.jpeg') this.src = 'No-Image-Available2.jpeg';" >
                </img>
            </li>`;
        })
        .join('');
        
            moviesList.innerHTML = htmlString;
    
    
};

const displayMoviesFiltered = (response) => {
    const htmlString = response.map((movie) => {
            return `
            <li class="movie" <a onclick="loadDetails('${movie.Title}',searchString_global)"
            href="movieDetails.html"></a>
                <h2 class="movieTitlebutton">${movie.Title}</h2>
                <img src= ${movie.Poster} onerror="if(this.src != 'No-Image-Available2.jpeg') this.src = 'No-Image-Available2.jpeg';" >
                </img>
            </li>`;
        })
        .join('');
    moviesList.innerHTML = htmlString;
};


// gets the total number of pages that are going to be displayed for the user to choose
var totalNumpages_global = 1;
var totalNumresults_global;
function getTotalnumPages(response){
    var totalNumresults = response.totalResults;
    totalNumresults_global = totalNumresults;
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
function loadDetails(movieTitle,previousSearch){
        sessionStorage.setItem('movieTitle',movieTitle);
        sessionStorage.setItem('currentMoviesearchTemp', previousSearch);
        sessionStorage.setItem('nextMovieSearch', "undefined");
        window.location = 'movieDetails.html';
        return false;
    
};

// function setMoviesearchStorage(currentMoviesearch){
//     sessionStorage.setItem('currentMoviesearchTemp', currentMoviesearch);
//     window.location = 'movieDetails.html';
//     return false;
// }

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
    $.getJSON('https://www.omdbapi.com/?t=' + movieTitle + '&apikey=ae410769').then(function(response){
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

function displayNumresults(totalNumresults_global){
    var numResultsDisplay = document.getElementById("numResultsDisplay").innerHTML;
        if (totalNumresults_global == 1){
            document.getElementById("numResultsvalue").innerHTML = "Showing " + totalNumresults_global + " result";
        }
        else {
            document.getElementById("numResultsvalue").innerHTML = "Showing " + totalNumresults_global + " results";
        }
          
};




function displayTimeFilter(){
    let timeFilterHTML =
        `<p id="searchByYear-timeFilter">Filter Search By Year: </p>
        <input id = "timeFilterboxMin" placeholder = "ex: 2000"></input>
        <p id="to-in-TimeFilter"> to </p>
        <input id = "timeFilterboxMax" placeholder = "ex: 2010"></input>`;
        
        containerTimeFilter.innerHTML = timeFilterHTML;
};

function filterResponsebyYear(response){
    console.log("response inside filterResponsebyYear function:");
    console.log(response);
    if (isPaganationremoved == false){
        removePaganationbuttons();
    }
    if (isShowmoreButtonremoved == false){
        removeShowmoreButton();
    }
    console.log("minYearparam_global: "+ minYearparam_global);
    console.log("maxYearparam_global: "+ maxYearparam_global);
     timeFilteredResponse_global = response.filter(function(movie){
         console.log("movie.Year: " + movie.Year);
        return (movie.Year >= minYearparam_global && movie.Year <= maxYearparam_global);
        console.log((movie.Year >= minYearparam_global && movie.Year <= maxYearparam_global));
    })
    if (timeFilteredResponse_global.length === 0){
        isnoResultsFoundfiltered = true;
    }
};
var firstResponse;
var concatResponse
var nextResponse;
function showMoreresults(currentPagenum, currentResponse){
    removePaganationbuttons();
    removeShowmoreButton();
    isShowMoreclicked = true;
    // console.log("totalNumpages_global in showMoreresults function: " + totalNumpages_global);
    $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + currentPagenum).then(
        function(response){
                nextResponse = response.Search;
                // console.log("nextResponse (page 2 for first one):")
                // console.log(nextResponse);
                
                if (currentPagenum <= totalNumpages_global && currentPagenum == 1){
                     firstResponse = response.Search;
                     console.log("firstResponse (page 1): ");
                     console.log(firstResponse);
                    showMoreresults(currentPagenum + 1, firstResponse);
                }
                    if (currentPagenum <= totalNumpages_global && currentPagenum != 1){
                        concatResponse = currentResponse.concat(nextResponse);
                        console.log("concatResponse:")
                        console.log(concatResponse);
                        showMoreresults(currentPagenum + 1, concatResponse);
                    }
                    else{
                        console.log(concatResponse);
                        displayMoviesFiltered(concatResponse);
                    }
                            
        });
        
};

function removePaganationbuttons(){
    isPaganationremoved = true;
    // var paginationWrapper = document.getElementById('pagination-wrapper');
    // paginationWrapper.parentNode.removeChild(paginationWrapper);
    // return false;
    clearElement("#pagination-wrapper");
};

function removeShowmoreButton(){
    isShowmoreButtonremoved = true;
    // var showMorebutton = document.getElementById('showMorebutton');
    // showMorebutton.parentNode.removeChild(showMorebutton);
    $("#showMorebutton").remove();
};

function createShowMoreButton(){
    let createShowMoreButtonHTML =
        `<button id= "showMorebutton">Show More</input>`;
        showMorebuttonDiv.innerHTML = createShowMoreButtonHTML;
}


//FIX HTML TAG ATTACHMENT
function displayNoresultsFound(){
    console.log("displayNoresultsFound() activated");
    // let noResultsFoundHTML =
    // `<h1 id="No-results-found">No Results Found</h1>`;
    // noResultsFound.innherHTML = noResultsFoundHTML;
        document.getElementById("noResultsFoundtext").innerHTML = "No Results Found";
    
};

function clearElement(elementTag){
    // var moviesListresults = document.getElementsByClassName('moviesList');
    // console.log("clearElement() activated");
    // for(var x = 0; x < moviesListresults.length; x++) {
    //     moviesListresults[x].innerHTML = "";
    // }
    $(elementTag).empty();
};


$(document).on( 'keyup', '#timeFilterboxMin', function (e) {
    var minYearparam = (e.target.value);
    minYearparam_global = minYearparam;
    // console.log("minYearparam:" + minYearparam);
});

$(document).on( 'keyup', '#timeFilterboxMax', function (e) {
    
    if (e.keyCode == 8) {
        isgetRidofFilterSearch = true;
        loadMovies();
    }
    isFilteredSearch = true;
    var maxYearparam = (e.target.value);
    maxYearparam_global = maxYearparam;
    console.log("maxYearparam:" + maxYearparam);
    loadMovies();
});

$(document).on( 'click', '#showMorebutton', function () {
    showMoreresults(pageNum, nextResponse);
});



    



    
