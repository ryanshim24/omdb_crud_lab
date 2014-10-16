var express = require("express"); //Gets node module express
var request = require("request"); // Gets node module request
var bodyParser = require('body-parser'); // node module bodyParser
var methodOverride = require('method-override'); // node module methodOverride
var app = express(); //call function express into var app



app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

var moviesList = []; //Array where I'll dump my movies that I'm interested in
var idCounter = 1; //Counter so I can put an id on my movie favorites so I can remove them


//Home
app.get('/', function(req, res){ //Routes to Home Page
  res.render('index.ejs'); //Renders from the file index.ejs
});


//New
app.get('/search', function(req, res){ //Routes to search page

  var searchTerm = req.query.movieTitle; //Grabs teh data that comes after /search/movieTitle
  var url = "http://www.omdbapi.com/?s=" + searchTerm; //sends into api so we can get our search info

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body); //Parse so we can change string into obj
      res.render("results.ejs", {movieList: obj.Search, searchTerm: searchTerm}); //Renders from results page
      //Pushed in another key value SearchTerm so my searchbar retains the searched item
    }
  });
});



//New
app.get('/details/:id', function(req,res) { //Routing to specific movie page
  var detailTerm = req.params.id; //Grabs the id of what we call back in this case /details/imbdID number from link wrap
  var url ="http://www.omdbapi.com/?i=" + detailTerm;
  // We now get the information from the id api to get more info abou that specific movie
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var obj1 = JSON.parse(body);
      res.render("detail.ejs",{detailList: obj1}); //renders from detail file
    }
  }); 
});




//Show
app.get('/interested', function(req,res) { //Routing to interested page
  res.render('interest.ejs',{interestMovies: moviesList}); //pushes moviesList array to the interested page
});




//Create
app.post('/interested', function(req,res) {  //from my submit in detail page we now could route to our interested page
  
  var newTitle = {}; //Create a new obj newTitle
  newTitle.imdbID = req.body.movie.imdbID;
  newTitle.id = idCounter;//create a property id for the Movie id
  newTitle.title = req.body.movie.title;//Grab the name of the input value so we can add it to the name property
  moviesList.push(newTitle); //Push this obj into the moviesList array for the interested movies
  idCounter++; //Increment the counter so next movie would be Movie id 2
  console.log(req.body.movie);
  res.redirect('/interested'); //Go to interested page
});




//Destory
app.delete('/interested/:id', function(req,res) { 
  // console.log("DELETE ROUTE");
  var id = Number(req.params.id); //When I click the button it sends the action to this app.delete Convert that id to number
  // console.log("This is id:" +id);
  moviesList.forEach(function(list) { //Goes through the moviesList array
    // console.log("This is list.id:" + list.id);
    if(list.id === id) {  //If i find the id which my button is associated with in the movieList array I want to remove that one
      // console.log("FOUND!!!!!!");
      var index = moviesList.indexOf(list);//Removes movie from the list
      moviesList.splice(index,1);//Removes movie from the list
    }
  });
  res.redirect('/interested'); //Redirects to my interested age after a delete
});



app.get('/about', function(req,res) { //My about page
  res.render('about.ejs');
});

app.get('/contact', function(req, res) { // My contact page
  res.render('contact.ejs');
});












app.listen(3000);
