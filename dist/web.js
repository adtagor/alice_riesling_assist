'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');

var _require = require('url'),
    URL = _require.URL;

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.post('/webhook', function (req, res) {
  var search = req.body.queryResult.parameters;
  var api_url = 'http://api.openweathermap.org/data/2.5/forecast?cnt=2&units=metric&lang=pt&appid=' + process.env.WEATHER_API;
  var reqUrl = new URL(api_url + '&q=' + search['geo-city']);

  http.get(reqUrl, function (responseFromAPI) {
    responseFromAPI.on('data', function (chunk) {
      var weather = JSON.parse(chunk);
      var dataToSend = weather.cod === '200' ? 'Tempo para ' + weather.city.name + ' em 6 horas : ' + weather.list[1].weather[0].description + ', temperatura : ' + weather.list[1].main.temp + '\xB0C, humidade: ' + weather.list[1].main.humidity + '%' : 'Não consegui entender a cidade, pode especificar melhor ?';

      return res.json({
        "fulfillmentText": dataToSend,
        "fulfillmentMessages": [{
          "text": {
            "text": [dataToSend]
          }
        }],
        "source": "weather"
      });
    });
  }, function (error) {
    return res.json({
      "fulfillmentText": 'Não consegui entender a cidade, pode especificar melhor ?',
      "fulfillmentMessages": [{
        "text": {
          "text": ['Não consegui entender a cidade, pode especificar melhor ?']
        }
      }],
      "source": "weather"
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

  console.log('Web server started at http://' + host + ':' + por);
});