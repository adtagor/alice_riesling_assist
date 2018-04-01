var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.post('/webhook', function (req, res) {
  var search = req.body.queryResult.parameters;

  var API_KEY = 'ab82760e50ec15b32856658ebb4f51cd';
  var API_URL = `http://api.openweathermap.org/data/2.5/forecast?&units=metric&lang=pt&appid=${API_KEY}`;
  var reqUrl = `${API_URL}&q=${search['geo-city']}`;

  http.get(reqUrl, (responseFromAPI) => {

    responseFromAPI.on('data', function (chunk) {

      let weather = JSON.parse(chunk);

      let dataToSend = `
      Tempo para ${weather.city.name} em 6 horas : ${weather.list[1].weather[0].description}
      Temperatura : ${weather.list[1].main.temp}
      Humidade: ${weather.list[1].main.humidity}
      `;

      return res.json({
        speech: dataToSend,
        displayText: dataToSend,
        source: 'weather'
      });

    });
  }, (error) => {
    return res.json({
      speech: 'Something went wrong!',
      displayText: 'Something went wrong!',
      source: 'weather'
    });
  });
});

// server.post('/get-movie-details', function (req, res) {

//   let movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
//   let reqUrl = encodeURI('http://theapache64.xyz:8080/movie_db/search?keyword=' + movieToSearch);
//   http.get(reqUrl, (responseFromAPI) => {

//     responseFromAPI.on('data', function (chunk) {
//       let movie = JSON.parse(chunk)['data'];
//       let dataToSend = movieToSearch === 'The Godfather' ? 'I don\'t have the required info on that. Here\'s some info on \'The Godfather\' instead.\n' : '';
//       dataToSend += movie.name + ' is a ' + movie.stars + ' starer ' + movie.genre + ' movie, released in ' + movie.year + '. It was directed by ' + movie.director;

//       return res.json({
//         speech: dataToSend,
//         displayText: dataToSend,
//         source: 'get-movie-details'
//       });

//     });
//   }, (error) => {
//     return res.json({
//       speech: 'Something went wrong!',
//       displayText: 'Something went wrong!',
//       source: 'get-movie-details'
//     });
//   });
// });


var port = process.env.PORT || 8879;
var server = app.listen(port, function () {
  var host = server.address().address;
  var por = server.address().port;

  console.log(`Web server started at http://${host}:${por}`);
});
