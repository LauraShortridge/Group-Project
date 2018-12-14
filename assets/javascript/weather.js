//This creates the weather div.

let weatherDiv; 

$(document).ready(function getWeather() {
  let queryURL = "http://api.openweathermap.org/data/2.5/weather?id=5152599&units=imperial&APPID=59fa64a59c523e5cf75b9209eba9344f"

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);

    weatherDiv = $("<div class='weather'>");

    let description = response.weather[0].description; 
    let descriptionText = $("<p>").text(description);
    weatherDiv.append(descriptionText); 

    let temperature = response.main.temp; 
    let tempText = $("<p>").text(temperature + " \xBAF"); 
    weatherDiv.append(tempText); 

    let tempHigh = response.main.temp_max;
    let tempHighText = $("<p>").text("High: " + tempHigh + " \xBAF").addClass("smallText");
    weatherDiv.append(tempHighText);

    let tempLow = response.main.temp_min; 
    let tempLowText = $("<p>").text("Low: " + tempLow + " \xBAF").addClass("smallText");
    weatherDiv.append(tempLowText);

    let iconCode = response.weather[0].icon;
    let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    let iconDisplay = $("<img>").attr("src", iconURL); 
    weatherDiv.append(iconDisplay);
  
    $("#weather-report").append(weatherDiv).css("textTransform", "capitalize"); 

  });
});