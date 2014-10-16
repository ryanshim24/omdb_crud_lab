var express = require("express");
var request = require("request");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();



app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

var moviesList = [];
var idCounter = 1;



app.get('/', function(req, res){
  res.render('index.ejs');
});


app.get('/search', function(req, res){

  var searchTerm = req.query.movieTitle;
  var url = "http://www.omdbapi.com/?s=" + searchTerm;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      res.render("results.ejs", {movieList: obj.Search});
    }
  });
});

app.get('/details/:id', function(req,res) { 
  var detailTerm = req.params.id;
  var url ="http://www.omdbapi.com/?i=" + detailTerm;

  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var obj1 = JSON.parse(body);
      res.render("detail.ejs",{detailList: obj1});
    }
  }); 
});


app.get('/interested', function(req,res) { 
  res.render('interest.ejs',{interestMovies: moviesList});
});


app.post('/interested', function(req,res) { 
  var newTitle = {};
  newTitle.id = idCounter;
  newTitle.title = req.body.movie.title;
  moviesList.push(newTitle);
  idCounter++;
  res.redirect('/interested');
});

app.delete('/interested/:id', function(req,res) { 
  console.log("DELETE ROUTE");
  var id = Number(req.params.id);
  console.log("This is id:" +id);
  moviesList.forEach(function(list) {
    console.log("This is list.id:" + list.id);
    if(list.id === id) { 
      console.log("FOUND!!!!!!");
      var index = moviesList.indexOf(list);
      moviesList.splice(index,1);
    }
  });
  res.redirect('/interested');
});




app.listen(3000);
