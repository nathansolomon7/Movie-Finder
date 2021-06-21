
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
 var tempCountprev = 0;
 var loadMoviesCounter;
 var startingPageNumArray = [];
 // used in the API request to display the according "page" of movie search results
 var pageNum = 1;
 
 
// the user's text in the search bar is set to searchStringtemp and is constantly updated 
//upon each key press without them pressing the submit button
var searchBartextValues = document.getElementsByClassName('searchBartext');
for(var x = 0; x < searchBartextValues.length; x++) {
    searchBartextValues[x].addEventListener('keyup', (e) => {
        searchStringtemp = (e.target.value);
        loadMoviesCounter = 0;
        // searchStringtemp value is passed to global variable for other functions to access the string
        searchString_global = searchStringtemp;
        autoCompleteloadMovies();
    });
}


function loadMovies(){
    try{
        //counter is used to handle an edge case where the PageNum is not equal to 1 
        // as it should upon calling loadMovies() if the user does not clear out their
        // filter search boxes prior to making a standard search
        loadMoviesCounter++;
        
        if(loadMoviesCounter == 1){
            if (pageNum != 1){
                pageNum = 1;
            }
        }
        isFilteredSearch = false;
        isnoResultsFoundfiltered = false;
        
        // if the page is reloaded (causing the script to forget what the user typed in), 
        // whatever the user clicked on for details previously will be used instead as the 
        // assumed searchString
         if(searchString_global === undefined || searchString_global == ""){
             searchString_global = sessionStorage.getItem('currentMoviesearchTemp');
         }
        $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + pageNum).then(
            function(response){
                response_global = response;
            
            if(response.Error == "Movie not found!"){
                // will print "No Results Found if no results found"
                clearScreenforNoresults();
                isnoResultsFoundfiltered = false;
                return;
            }
            if(response.Error == "Too many results."){
                // will print "Too Many Results if too many results"
                clearScreeenforToomanyResults();
                return;
                
            }
            var totalNumpages = getTotalnumPages(response);
            //displays how many results are available for the user to go through across all pages for standard search
            displayNumresults(totalNumresults_global);
            
            
            
            if(totalNumresults_global < 10 ){
                // remove the paganation and showMore buttons if there are less than 10 results for a standard Search
                removeShowmoreButton();
                removePaganationbuttons();
            }
            
            if(pageNum == totalNumpages_global){
                
                // remove the showMore button if there are no more pages left to access
                removeShowmoreButton();
            }
    
            if(isFilteredSearch == false && isnoResultsFoundfiltered == false){
                //clears the page of the showMore and paganation buttons before 
                //being dynamically generated if the amount of results meet 
                //the conditions below
                clearElement("#noResultsFoundtext");
                clearElement("#paginationWrapper");
                clearElement("#showMorebutton");
                if (searchString_global != null || searchString_global != undefined){
                    // function is called to then display the movies on the page
                displayMovies(response);
                }
            }
            
            if (isFilteredSearch == false && isnoResultsFoundfiltered == false){
                if(isgetRidofFilterSearch == false && totalNumresults_global > 10){
                    // if the number of results is greater than 10, a time filter is given
                    // to the user so they have the option to do a filter search on top 
                    // of their standard search
                    displayTimeFilter();
                }
                else if(totalNumresults_global < 10){
                    // if the number of results is less than 10, the Filter Search option is not given
                    $("#containerTimeFilter").remove();
                }
                
                //Show More option and the paganation buttions are shown if number of results is greater than 10
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
            //upon entering the site for the first time, searchString_global is null.
            // To prevent "null" as a result shown without the user entering it,
            //the page is cleared before the user makes another search that is not "null" 
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

//clears the page by removing the buttons when no results are found from the api call
// and states no results are found
function clearScreenforNoresults(){
    displayNumresults(0);
    displayNoresultsFound();
    clearElement("#moviesList");
    clearElement("#paginationWrapper");
    removeShowmoreButton();
    clearElement("#containerTimeFilter");
};
//clears the page by removing the buttons when too many results are found and displays 
//"too many results"
function clearScreeenforToomanyResults(){
    displayNumresults(0);
    displayToomanyResultsfound();
    clearElement("#moviesList");
    clearElement("#paginationWrapper");j
    removeShowmoreButton();
    clearElement("#containerTimeFilter");
};

//for each key press in the search bar, an API call is made. The results are 
//saved in an array that changes upon each key press, which is shown to the user 
// with the function displayAutocompleteSuggestions
function autoCompleteloadMovies(){
    $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + pageNum).then(
        function(response){
        
            if(response.Error == "Too many results." || response.Error == "Movie not found!"){
                return;
            }
                var autoCompleteArray = [];
                response.Search.map((movie) => {
                    
                autoCompleteArray.push(movie.Title);
                displayAutocompleteSuggestions(autoCompleteArray);
            })
        })
    
};
//dynamically generates each movie recommendation as HTML in the autocomplete list of results
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
    searchString_global = nextMovieSearch;
    
    if(nextMovieSearch == "undefined"){
        var previousSearch = sessionStorage.getItem('currentMoviesearchTemp');
        
    
        searchString_global = previousSearch;
    }
    if(previousSearch == ""){
        isgetRidofFilterSearch = true;
        clearElement("#numResultsDisplay");
        return;
    }
    
    
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
// takes in an array of movies objects and dynamically generates HTML 
//for each movie Title and poster, which is displayed in the moviesList
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
//takes in the response from the API call, gets the total amount of results, and 
//finds the amount of pages that can be displayed with said amount of results
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
        if(isFilteredSearch == true){
            generatePagebuttons();
            if(pageNum == 1){
                $("#prevPagebutton").remove();
            }
            startingPageNumArray.push(pageNum);
            // instead of creating a new API call with an updated page number like 
            // in the standard search, the remaining spliced array of show movies 
            // not displayed is conctanated upon to eventually be displayed in the next 
            // page call
            filterSearchpaganation(concatFilteredArray_global);
        } else if(isFilteredSearch == true && concatFilteredArray_global.length <= 10 || pageNum  == totalNumpages_global){
            $("#nextPagebutton").remove();
            var filtered10results = concatFilteredArray_global.splice(0,10);
            displayMoviesFiltered(filtered10results);
        }
    }
    else{
    loadMovies();
    }
});
// when the previous page button is clicked, the loadMovies() function is called,
// except the numPages variable is subtracted by 1 to take an API call for the page 
// previous to its current page
// If the previous button is clicked during a filtered search, filterSearchpaganation() is called with a 
// a page count 1 less of its current state
$(document).on( 'click', '#prevPagebutton', function () {
     
    tempCountprev++;
    if(isFilteredSearch == true){
        var index = startingPageNumArray.length - tempCountprev;
        pageNum = startingPageNumArray[index - 1];
        if(pageNum == "undefined" || pageNum == undefined){
            pageNum = 1;
        }
        filterSearchpaganation(concatFilteredArray_global);
        if(pageNum == 1){
            $("#prevPagebutton").remove();
        }
    } 
    else{
        pageNum--;
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







//displays the HTML for the time filter
function displayTimeFilter(){
    let timeFilterHTML =
        `<p id="searchByYear-timeFilter">Filter Search By Year: </p>
        <input id = "timeFilterboxMin" placeholder = "ex: 2000"></input>
        <p id="to-in-TimeFilter"> to </p>
        <input id = "timeFilterboxMax" placeholder = "ex: 2010"></input>`;
        
        containerTimeFilter.innerHTML = timeFilterHTML;
};

//filters the array of objects by Year and returns the filtered objects in the array timeFilteredResponse_global
function filterResponsebyYear(response){
    
     timeFilteredResponse_global = response.filter(function(movie){
         
        return (movie.Year >= minYearparam_global && movie.Year <= maxYearparam_global);
    })
    if (timeFilteredResponse_global.length == 0){
        isnoResultsFoundfiltered = true;
        
    }
    return timeFilteredResponse_global;
};

var firstResponseArray;
var concatResponse
var nextResponse;
var startingPageNum;

function showMoreresults(currentPagenum, firstResponse){
    
    isShowMoreclicked = true;
    //firstResponse holds the first API call for page 1, whose array of movies is 
    //stored in firstResponseArray
    firstResponseArray = firstResponse.Search;
    currentPagenum = currentPagenum + 1;
    $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + currentPagenum).then(
        function(response){
            //nextResponse stores the page 2 of the API call's results
            nextResponse = response.Search;
            if (currentPagenum == 2){
                // if its the first time showMore is being pressed, concatanate 
                // the first page of results with the second page of results
                concatResponse = firstResponseArray.concat(nextResponse);
            }else{
                // if not the first time showMore is pressed, concatanate the current 
                //combined response with the succeeding page's response to then display to the user
                concatResponse = concatResponse.concat(nextResponse);
            }
                pageNum ++;
                    // displays the concatanated array to the user when show More is pressed,
                    // thus showing more than 10 results to the user
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
     // if the current function displayed is larger than 10 movies, the array is spliced
     // and saved in remainingConcatFilteredArray_global. This is done because 
     // concatFilteredArray_global can be larger than 20 movies, and we want to display 
     // only 10 extra at a time
    if(concatFilteredArray_global.length > 10){
        var remainingConcatFilteredArray_global = concatFilteredArray_global.splice(0,10);
        if(showMoreFiltercount == 1){
            // if first Show More press, concatanate the most recent 10 movies that were 
            // spliced from the potentially larger array concatFilteredArray_global with 
            // the currently displayed 10 movies
             arrayOfTensLength = concatTenarray_global.concat(remainingConcatFilteredArray_global);
            displayMoviesFiltered(arrayOfTensLength);
        } else{
            // if not the first time Show More is pressed, concatanate what is already 
            // displayed with the remeaining amount of movies not displayed
            arrayOfTensLength = arrayOfTensLength.concat(remainingConcatFilteredArray_global);
            displayMoviesFiltered(arrayOfTensLength);
        }
    }
    else if(concatFilteredArray_global.length <= 10){
        // if concatFilteredArray_global is <= 10 movies, just concatanate what is already 
        // displayed with the concatFilteredArray_global and save in a different variable 
        // that can not be used again for concatanation
        var finalArray = arrayOfTensLength.concat(concatFilteredArray_global);
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
    
    isFilteredSearch = true;
            $.getJSON('https://www.omdbapi.com/?s=' + searchString_global + '&apikey=ae410769' + '&page=' + pageNum).then(
                function(response){
                    
                    
                    // if the filter search is on page 1, then do not use an array passed 
                    //for concatanation with other filtered results. Instead, get the first 
                    // response by making an API call, then passing that array of movies into 
                    // the function recursively to be used for concatanation in the next conditional
                    if (pageNum == 1 || (currentResponseArray.length <= 10 && pageNum != totalNumpages_global && tempCount == 1)){
                        tempCount++;
                        firstResponseArray = filterResponsebyYear(response.Search);
                        pageNum++;
                        filterSearchpaganation(firstResponseArray);
                    }
                     
                     // if the passed in array of objexts is less than or equal to 20 and the pageNum 
                     // hasnt surpassed the max amount of pages the search generates, 
                     // concatanate the current Array of filtered movies with the succeeding page's 
                     // filtered results. this loop continues recursively until the current array surpasses 20 movies
                    else if (currentResponseArray.length <= 20 && pageNum <= totalNumpages_global && pageNum != 1 ){
                         var nextResponseArray = filterResponsebyYear(response.Search);
                         concatFilteredArray_global = currentResponseArray.concat(nextResponseArray);
                         pageNum++;
                         filterSearchpaganation(concatFilteredArray_global);
                    }
                     else{
                         pageNum--;
                         // the array of 20 is passed into conditionalDisplayfilteredResults
                         // for displaying to user
                         conditionalDisplayfilteredResults(concatFilteredArray_global);
                         return;
                     }
                    
                    
                });
};

function conditionalDisplayfilteredResults(concatFilteredArray_global){
    displayNumresultsFiltered(concatFilteredArray_global.length);
    // if the passed in array is greater than 10, splice the first 10 movies and display 
    // them, with the original array having 10 less movies now. The remaining amount 
    // of movies not shown is displayed on next page press or on show more press
    if(concatFilteredArray_global.length > 10){
        var concatTenarray = concatFilteredArray_global.splice(0,10);
        concatTenarray_global = concatTenarray;
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
    // if the concatFilteredArray_global is less than 10, pass in the function 
    // in its entirety to displayMoviesFiltered for the user to see
    else if(concatFilteredArray_global.length <= 10 && pageNum == totalNumpages_global ){
        removeShowmoreButton();
        $("#nextPagebutton").remove();
        displayMoviesFiltered(concatFilteredArray_global);
        return;
    }
};
            

                        

        
// removes the previous and next buttons
function removePaganationbuttons(){
    isPaganationremoved = true;
    
    clearElement("#paginationWrapper");
};


// removes the show more button
function removeShowmoreButton(){
    isShowmoreButtonremoved = true;
    
    $("#showMorebutton").remove();
};

function createShowMoreButton(){
    let createShowMoreButtonHTML =
        `<button id= "showMorebutton">Show More</input>`;
        showMorebuttonDiv.innerHTML = createShowMoreButtonHTML;
}






//generates the HTML to say No results Found
function displayNoresultsFound(){
    
        document.getElementById("noResultsFoundtext").innerHTML = "No Results Found";
    
};
//generates the HTML to say too many results
function displayToomanyResultsfound(){

    document.getElementById("noResultsFoundtext").innerHTML = "Too Many Results";
}


// will empty the element passed in
function clearElement(elementTag){
    
    $(elementTag).empty();
};

//if anyehere other than the autocom box is pressed, the recommendations are hidden
$('.container').click( function() {
    
        $('.autocomBox').hide();
    
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
    // if backspace is pressed the standard movie search is ran anf gets rid of 
    // the filter search
    if (e.keyCode == 8) {
        pageNum = 1;
        isgetRidofFilterSearch = true;
        isFilteredSearch = false;
        if(minYearparam_global > 999){
            loadMovies();
        }
        
    }
    
    
});



$(document).on( 'keyup', '#timeFilterboxMax', function (e) {
    isFilteredSearch = true;
    loadMoviesCounter = 0;
    pageNum = 1;
    if (e.keyCode == 8) {
        // if backspace is pressed the standard movie search is ran anf gets rid of 
        // the filter search
        // startingPageNumArray (used to keep track of the starting pages ran 
        //on filter searches for when previous button is pressed), is re-set when 
        // the filter search is stopped and replaced with the standard search
        startingPageNumArray = [];
        pageNum = 1;
        isgetRidofFilterSearch = true;
        isFilteredSearch = false;
        loadMovies();
    }
    var maxYearparam = (e.target.value);
    maxYearparam_global = maxYearparam;
    
    generatePagebuttons();
    if(pageNum == 1){
        $("#prevPagebutton").remove();
    }
    if(maxYearparam_global > 999){
        startingPageNumArray.push(pageNum);
        // if the year number is large enough, a filter search is ran automatically
    filterSearchpaganation(response_global);
    }
});


//if anyehere other than the autocom box is pressed, the recommendations are hidden
$('.container').click( function() {
    
        $('.autocomBox').hide();
    
});
//if anyehere other than the autocom box is pressed, the recommendations are hidden
$('#showcase').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});
//if anyehere other than the autocom box is pressed, the recommendations are hidden
$('#numResultsDisplay').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});
//if anyehere other than the autocom box is pressed, the recommendations are hidden
$('#containerTimeFilter').click( function() {
    // isBodyclicked = true;
    // if (isBodyclicked == true){
        $('.autocomBox').hide();
    //     isBodyclicked = false;
    // }
});


//if the sesrchBar text is pressed, the autocom box is revealed
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
        // if it is a filtered search and show more button is pressed,
        //showMoreresultsFiltered is called;
        showMoreresultsFiltered(concatFilteredArray_global);
    }
    else{
        // when show More button is pressed, showMore results is called
        showMoreresults(pageNum, response_global);
    }
    
});



    



    
