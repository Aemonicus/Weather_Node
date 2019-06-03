const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/ac752a061044f4d8d50ab1d82a3968ca/${latitude},${longitude}?units=si&lang=fr`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        body.daily.data[0].summary +
          " La température actuelle est de " +
          body.currently.temperature +
          " °C et les probabilités pour subir la flotte divine s'élèvent à " +
          body.currently.precipProbability +
          "%."
      );
    }
  });
};

module.exports = forecast;
