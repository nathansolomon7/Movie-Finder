//TODO: 

//change the results for filtered to say "..on this page"

//RE COMMENT THINGS





 //used to get a user's text inputted into the search bar
 var searchString_global;
 var searchStringtemp;
 var isBackPagepressed = false;
 var maxYearparam_global;
 var minYearparam_global;
 var isFilteredSearch = false;
 var isShowMoreclicked = false;
 var isPaganationremoved = false;
 var isShowmoreButtonremoved = false;
 var isnoResultsFoundfiltered = false;
 var isgetRidofFilterSearch = false;
 var isMoretenFilteredresults = false;
 var isEndReachedShowMore = false;
 var startingPageNum;
 var response_global;
 var concatFilteredArray_global;
 var concatTenarray_global;
 var arrayOfTensLength;
 var showMoreFiltercount = 0;
 var tempCount = 1;
 var loadMoviesCounter;
 // isLessTenresults = false;
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
        autoCompleteloadMovies();
    });
}


function loadMovies(){
    try{
        console.log("running loadMovies()");
        console.log("pageNum in loadMovies(): " + pageNum);
        console.log("loadMoviesCounter before: " + loadMoviesCounter);
        loadMoviesCounter++;
        console.log("loadMoviesCounter after: " + loadMoviesCounter);
        if(loadMoviesCounter == 1){
            console.log("about to change the value of pageNum to 1");
            if (pageNum != 1){
                pageNum = 1;
            }
        }
        console.log("pageNum in loadMovies after check: " + pageNum);
        isFilteredSearch = false;
        isnoResultsFoundfiltered = false;
        console.log("isgetRidofFilterSearch is:" + isgetRidofFilterSearch);
        console.log("running loadMovies()");
        console.log(searchString_global);
        console.log("above is searchString_global in the loadMovies function");
        //request is sent to API as a general movie search, using the user's inputted string
         // setMoviesearchStorage(searchString_global);
         if(searchString_global === undefined || searchString_global == ""){
             searchString_global = sessionStorage.getItem('currentMoviesearchTemp');
         }
        $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + pageNum).then(
            function(response){
                response_global = response;
            console.log(response);
            if(response.Error == "Movie not found!"){
                clearScreenforNoresults();
                isnoResultsFoundfiltered = false;
                return;
            }
            if(response.Error == "Too many results."){
                clearScreeenforToomanyResults();
                return;
                
            }
            var totalNumpages = getTotalnumPages(response);
            console.log("totalNumresults_global: " + totalNumresults_global);
            displayNumresults(totalNumresults_global);
            
            if ((isFilteredSearch == true) && (maxYearparam_global > 999)){
                if(timeFilteredResponse_global.length < 10){
                    $("#nextPagebutton").remove();
                    $("#prevPagebutton").remove();
                }
                isFilteredSearch = false;
                return;
                console.log("made it past return in filterSearch (bad)");
            
            }
            
            if(totalNumresults_global < 10 ){
                removeShowmoreButton();
                removePaganationbuttons();
            }
            
            console.log("pageNum value: " + pageNum);
            if(pageNum == totalNumpages_global){
                console.log("removeremoveShowmoreButton() activated for pageNum == totalNumpages_global");
                removeShowmoreButton();
            }
            
            
            console.log("totalNumpages:");
            console.log(totalNumpages);
            if(isnoResultsFoundfiltered == true){
                displayNoresultsFound();
                removePaganationbuttons();
                $("#paginationWrapper").remove();
                clearElement("#showMorebutton");
                return;
                 
            }
            // function is called to then display the movies on the page
            if(isFilteredSearch == false && isnoResultsFoundfiltered == false){
                clearElement("#noResultsFoundtext");
                clearElement("#paginationWrapper");
                clearElement("#showMorebutton");
                if (searchString_global != null || searchString_global != undefined){
                displayMovies(response);
                }
            }
            
            if (isFilteredSearch == false && isnoResultsFoundfiltered == false){
                console.log("made it here");
                if(isgetRidofFilterSearch == false && totalNumresults_global > 10){
                    displayTimeFilter();
                }
                else if(totalNumresults_global < 10){
                    $("#containerTimeFilter").remove();
                }
                
                if(totalNumresults_global > 10 && (searchString_global != null || searchString_global != undefined)){
                    if(pageNum != totalNumpages_global){
                        createShowMoreButton();
                    }
                    
                    generatePagebuttons(totalNumpages_global);
                    if(pageNum == 1){
                        $("#prevPagebutton").remove();
                    }  if(pageNum == totalNumpages_global){
                        $("#nextPagebutton").remove();
                    }
                    if(isnoResultsFoundfiltered == true){
                        $("#paginationWrapper").remove();
                    }
                    
                }
                
            }
            
            if(searchString_global == null || searchString_global == "null") {
                $("#containerTimeFilter").empty();
                    $("#numResultsDisplay").empty();
            }
            
            isFilteredSearch = false;
            isnoResultsFoundfiltered = false;
            isLessTenresults = false;
            isgetRidofFilterSearch = false;
            });
            
    }
    
     catch(err) {
        console.error(err);
    }
};

function clearScreenforNoresults(){
    displayNumresults(0);
    displayNoresultsFound();
    clearElement("#moviesList");
    clearElement("#paginationWrapper");
    removeShowmoreButton();
    clearElement("#containerTimeFilter");
};

function clearScreeenforToomanyResults(){
    displayNumresults(0);
    displayToomanyResultsfound();
    clearElement("#moviesList");
    clearElement("#paginationWrapper");j
    removeShowmoreButton();
    clearElement("#containerTimeFilter");
};


function autoCompleteloadMovies(){
    $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + pageNum).then(
        function(response){
            console.log(response);
        
            if(response.Error == "Too many results." || response.Error == "Movie not found!"){
                return;
            }
                var autoCompleteArray = [];
                response.Search.map((movie) => {
                    
                autoCompleteArray.push(movie.Title);
                console.log("autoCompleteArray: ");
                console.log(autoCompleteArray);
                displayAutocompleteSuggestions(autoCompleteArray);
            })
        })
    
};

function displayAutocompleteSuggestions(autoCompleteArray){
        
        var movieRecommendationsList = document.getElementsByClassName('movieRecommendationsList');
        
            const autoCompleteArrayHTML = autoCompleteArray.map((movie) => {
                    return `
                    <li <a onclick="loadDetails('${movie}', searchString_global)"
                    href="movieDetails.html">${movie}</a></li>`;
            }).join('');
        
        
        movieRecommendationsList[0].innerHTML = autoCompleteArrayHTML;
        
        
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
    searchString_global = nextMovieSearch;
    
    if(nextMovieSearch == "undefined"){
        var previousSearch = sessionStorage.getItem('currentMoviesearchTemp');
        
        console.log("previousSearch:" + previousSearch)
        searchString_global = previousSearch;
    }
    if(previousSearch == ""){
        console.log("previousSearch is empty")
        isgetRidofFilterSearch = true;
        clearElement("#numResultsDisplay");
        return;
    }
    
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
    let htmlStringdetails = 
    `<button type="button" id="prevPagebutton">Previous</button>
    <button type="button" id="nextPagebutton">Next</button`;
    // wrapper.innerHTML = '';
    // each button is given a different value in the ascending order that it is generated in
        paginationWrapper.innerHTML = htmlStringdetails;
};

//when a paigination button is clicked, pageNum's value is updated with the 
//pagination button's value. AN API request is sent with the updated pageNum in
//the loadMovies() function, giving 10 more search results to the user
$(document).on( 'click', '#nextPagebutton', function () {
    pageNum = pageNum + 1;
    if(isFilteredSearch == true){
        console.log("made it inside as a filtered search");
        if(isFilteredSearch == true){
            filterSearchpaganation(concatFilteredArray_global);
        } else if(isFilteredSearch == true && concatFilteredArray_global.length <= 10 && pageNum  == totalNumpages_global){
            $("#nextPagebutton").remove();
            var filtered10results = concatFilteredArray_global.splice(0,10);
            displayMoviesFiltered(filtered10results);
        }
    }
    else{
    console.log("totalNumpages_global after click:" + pageNum);
    loadMovies();
    }
});

$(document).on( 'click', '#prevPagebutton', function () {
    pageNum = pageNum - 1;
    if(isFilteredSearch == true){
        filterSearchpaganation(concatFilteredArray_global);
        if(pageNum == 1){
            $("#prevPagebutton").remove();
        }
        else{
            
        }
    } 
    else{
    console.log("totalNumpages_global after click:" + pageNum);
    loadMovies();
    }
});




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
    // var numResultsDisplay = document.getElementById("numResultsDisplay").innerHTML;
        if (totalNumresults_global == 1){
            document.getElementById("numResultsDisplay").innerHTML = "Showing " + totalNumresults_global + " result";
        }
        else {
            document.getElementById("numResultsDisplay").innerHTML = "Showing " + totalNumresults_global + " results";
        }
          
};

function displayNumresultsFiltered(totalNumresults_global){
    // var numResultsDisplay = document.getElementById("numResultsDisplay").innerHTML;
        if (totalNumresults_global == 1){
            document.getElementById("numResultsDisplay").innerHTML = "Showing " + totalNumresults_global + " result on this page";
        }
        else {
            document.getElementById("numResultsDisplay").innerHTML = "Showing " + totalNumresults_global + " results on this page";
        }
          
};








function displayTimeFilter(){
    console.log("now inside displayTimeFilter() function");
    let timeFilterHTML =
        `<p id="searchByYear-timeFilter">Filter Search By Year: </p>
        <input id = "timeFilterboxMin" placeholder = "ex: 2000"></input>
        <p id="to-in-TimeFilter"> to </p>
        <input id = "timeFilterboxMax" placeholder = "ex: 2010"></input>`;
        
        containerTimeFilter.innerHTML = timeFilterHTML;
};

function filterResponsebyYear(response){
    // console.log("unfiltered response inside filterResponsebyYear(): ");
    // console.log(response);
    
     timeFilteredResponse_global = response.filter(function(movie){
         // console.log("movie.Year: " + movie.Year);
        return (movie.Year >= minYearparam_global && movie.Year <= maxYearparam_global);
        console.log((movie.Year >= minYearparam_global && movie.Year <= maxYearparam_global));
    })
    if (timeFilteredResponse_global.length == 0){
        isnoResultsFoundfiltered = true;
        // console.log("isnoResultsFoundfiltered is: " + isnoResultsFoundfiltered);
    }
    return timeFilteredResponse_global;
};

var firstResponseArray;
var concatResponse
var nextResponse;
var startingPageNum;
function showMoreresults(currentPagenum, firstResponse){
    
    console.log("isFilteredSearch is: " + isFilteredSearch);
    isShowMoreclicked = true;
    firstResponseArray = firstResponse.Search;
    console.log("first response arrray: ");
    console.log(firstResponseArray);
    currentPagenum = currentPagenum + 1;
    $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + currentPagenum).then(
        function(response){
            nextResponse = response.Search;
            console.log("next response arrray: ");
            console.log(nextResponse);
            concatResponse = firstResponseArray.concat(nextResponse);
                pageNum ++;
                console.log("pageNum after showMoreresults(): " + pageNum); 
                console.log("concatResponse for displayMoviesFiltered");
                console.log(concatResponse);
                
            
                    displayMoviesFiltered(concatResponse);
                    if(pageNum == totalNumpages_global){
                        isEndReachedShowMore = true;
                        removeShowmoreButton();
                        $("#nextPagebutton").remove();
                        pageNum = 1;
                    }
                   
            });
        
};

function showMoreresultsFiltered(){
     showMoreFiltercount++;
    if(concatFilteredArray_global.length > 10){
        var remainingConcatFilteredArray_global = concatFilteredArray_global.splice(0,10);
        console.log("remainingConcatFilteredArray_global: ");
        console.log(remainingConcatFilteredArray_global);
        console.log("concatFilteredArray_global after splicing");
        console.log(concatFilteredArray_global);
        if(showMoreFiltercount == 1){
             arrayOfTensLength = concatTenarray_global.concat(remainingConcatFilteredArray_global);
            console.log("arrayOfTensLength thats gonna be displayed: ");
            console.log(arrayOfTensLength);
            displayMoviesFiltered(arrayOfTensLength);
        } else{
            arrayOfTensLength = arrayOfTensLength.concat(remainingConcatFilteredArray_global);
            displayMoviesFiltered(arrayOfTensLength);
        }
    }
    else if(concatFilteredArray_global.length <= 10){
        var finalArray = arrayOfTensLength.concat(concatFilteredArray_global);
        console.log("finalArray thats gonna be displayed: ");
        console.log(finalArray)
        displayMoviesFiltered(finalArray);
            removeShowmoreButton();
    } 
    return;
};

function filterSearchpaganation(currentResponseArray){
    if(pageNum == 1){
        $("#prevPagebutton").remove();
    }
    
    if(isEndReachedShowMore == true){
        createShowMoreButton();
        generatePagebuttons(totalNumpages_global);
        
        if(isnoResultsFoundfiltered == true){
            $("#paginationWrapper").remove();
            displayNoresultsFound();
        }
        isEndReachedShowMore = false;
    }
    
    console.log("currentResponseArray passed in before going into API call: ");
    console.log(currentResponseArray);
    isFilteredSearch = true;
    console.log("pageNum in filterSearchpaganation(): " + pageNum);
            $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + pageNum).then(
                function(response){
                    
                     //    if(pageNum <= totalNumpages_global){
                     //     var nextResponseArray = filterResponsebyYear(response.Search);
                     //     // console.log("nextResponseArray (filtered Array for first one): ");
                     //     // console.log(nextResponseArray);
                     // }
                    
                    if (pageNum == 1 || (currentResponseArray.length <= 10 && pageNum != totalNumpages_global && tempCount == 1)){
                        tempCount++;
                        firstResponseArray = filterResponsebyYear(response.Search);
                        // console.log("firstResponseArray (also filtered Array for first one): ");
                        // console.log(firstResponseArray);
                        pageNum++;
                        filterSearchpaganation(firstResponseArray);
                    }
                     
                     
                    else if (currentResponseArray.length <= 20 && pageNum <= totalNumpages_global && pageNum != 1 ){
                         var nextResponseArray = filterResponsebyYear(response.Search);
                        console.log("pageNum at bottom of loop (should be equal to 2 for first): ");
                        console.log(pageNum);
                         concatFilteredArray_global = currentResponseArray.concat(nextResponseArray);
                         console.log("current concatFilteredArray: ");
                         console.log(concatFilteredArray_global);
                         pageNum++;
                         console.log("pageNum before calling function again: " + pageNum);
                         console.log("pageNum <= totalNumpages_global:");
                         console.log(pageNum <= totalNumpages_global);
                         
                         filterSearchpaganation(concatFilteredArray_global);
                    }
                     else{
                         console.log("made it to the else statement");
                         console.log("final concatFilteredArray at ending of function:");
                         pageNum--;
                         console.log(concatFilteredArray_global);
                         conditionalDisplayfilteredResults(concatFilteredArray_global);
                         return;
                     }
                    
                    
                });
}

function conditionalDisplayfilteredResults(concatFilteredArray_global){
    console.log("inside conditionalDisplayfilteredResults()");
    displayNumresultsFiltered(concatFilteredArray_global.length);
    if(concatFilteredArray_global.length > 10){
        var concatTenarray = concatFilteredArray_global.splice(0,10);
        concatTenarray_global = concatTenarray;
        console.log("concat concatTenarray(whats gonna be filtered): ");
        console.log(concatTenarray);
        console.log("concatFilteredArray after being spliced: ");
        console.log(concatFilteredArray_global);
        displayMoviesFiltered(concatTenarray);
        return;
    }
    else if(concatFilteredArray_global.length == 0){
        displayNoresultsFound();
        $("#moviesList").empty();
        removeShowmoreButton();
        $("#nextPagebutton").remove();
        return;
    }
    else if(concatFilteredArray_global.length <= 10){
        removeShowmoreButton();
        $("#nextPagebutton").remove();
        $("#prevPagebutton").remove();
        displayMoviesFiltered(concatFilteredArray_global);
        return;
    }
};
            

                        

        

function removePaganationbuttons(){
    isPaganationremoved = true;
    // var paginationWrapper = document.getElementById('paginationWrapper');
    // paginationWrapper.parentNode.removeChild(paginationWrapper);
    // return false;
    clearElement("#paginationWrapper");
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

function displayToomanyResultsfound(){
    console.log("displayToomanyResultsfound activated");
    document.getElementById("noResultsFoundtext").innerHTML = "Too Many Results";
}

function clearElement(elementTag){
    // var moviesListresults = document.getElementsByClassName('moviesList');
    // console.log("clearElement() activated");
    // for(var x = 0; x < moviesListresults.length; x++) {
    //     moviesListresults[x].innerHTML = "";
    // }
    $(elementTag).empty();
};

$('.container').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});

$(".searchForm").submit(function(){
  pageNum = 1;
});



$(document).on( 'keyup', '#timeFilterboxMin', function (e) {
    isFilteredSearch = true;
    loadMoviesCounter = 0;
    pageNum = 1;
    var minYearparam = (e.target.value);
    minYearparam_global = minYearparam;
    if (e.keyCode == 8) {
        pageNum = 1;
        isgetRidofFilterSearch = true;
        isFilteredSearch = false;
        if(minYearparam_global > 999){
            loadMovies();
        }
        
    }
    
    // console.log("minYearparam:" + minYearparam);
});



$(document).on( 'keyup', '#timeFilterboxMax', function (e) {
    isFilteredSearch = true;
    loadMoviesCounter = 0;
    pageNum = 1;
    if (e.keyCode == 8) {
        pageNum = 1;
        isgetRidofFilterSearch = true;
        isFilteredSearch = false;
        loadMovies();
    }
    var maxYearparam = (e.target.value);
    maxYearparam_global = maxYearparam;
    console.log("maxYearparam:" + maxYearparam);
    if(maxYearparam_global > 999){
    filterSearchpaganation(response_global);
    }
});

// var isBodyclicked = false;

$('.container').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});

$('#showcase').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});

$('#numResultsDisplay').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});

$('#containerTimeFilter').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});



$('.searchBartext').keypress( function() {
    // isBodyclicked = false;
    // if (isBodyclicked == false){
        $('.autocomBox').show();
    // }
});




$(document).on( 'click', '#showMorebutton', function () {
    // isFilteredSearch = false;
    startingPageNum = pageNum;
    isShowMoreresults = true;
    if(isFilteredSearch == true){
        console.log("about to active showMoreresultsFiltered()");
        showMoreresultsFiltered();
    }
    else{
        showMoreresults(pageNum, response_global);
    }
    
});



    



    
