const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');

const app = express()

const apiKey = '469a28e6cea279e17b3db9ab58050259';

app.use(express.static('public'));
app.use("/assets", express.static(__dirname + '/assets'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  let city = "Waterloo";
  let wurl = `http://api.openweathermap.org/data/2.5/weather?q=${city},CA&units=metric&appid=${apiKey}`
  let furl = `http://api.openweathermap.org/data/2.5/forecast?q=${city},CA&units=metric&appid=${apiKey}`

  request(wurl, function (err, response, body) {
  	request(furl, function (err2, response2, body2) {
    if(err || err2){
      res.render('dashboard', {flogo:null, wlogo:null, weather: null, forecast:null, werror: 'Error, please try again', ferror: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      let forecast = JSON.parse(body2)
      if(weather.main == undefined){
        res.render('dashboard', {flogo:null, wlogo:null, weather: null, forecast:null, werror: 'Error, please try again', ferror: 'Error, please try again'});
      } else {
      	let forcastText = `${forecast.list[6].weather[0].description} ${forecast.list[6].main.temp}°C`;
        let weatherText = `${weather.weather[0].description} ${weather.main.temp}°C`;
        let wlogo = `${weather.weather[0].description}`;
        let flogo = `${forecast.list[6].weather[0].description}`;
        res.render('dashboard', {flogo:flogo, wlogo:wlogo, weather: weatherText, forecast: forcastText, werror: null, ferror: null});
      }
    }
  });
  });
})

app.listen(3002, function () {
  console.log('Example app listening on port 3002!')
}) 
