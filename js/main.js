let forecastContainer = document.getElementById("forecast");
let result = {};
let searchInput = document.getElementById("search");
const findButton = document.getElementById("find");


//events listeners on input change and on find button when clicked
searchInput.addEventListener("input", function (e) {
  getData(this.value);
});

findButton.addEventListener("click", function (e) {
  getData(searchInput.value);
});



//print function
function printData(result) {
  function getDayName(date = new Date(), locale = "en-US") {
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  function getMonthName(date = new Date(), locale = "en-US") {
    return date.toLocaleDateString(locale, { month: "long" });
  }
  function getDayOfMonth(date = new Date()) {
    return date.getDate();
  }

  if (result.current) {
    let currentDay = getDayName(new Date(result.current.last_updated));
    let DayOfMonth = getDayOfMonth(new Date(result.current.last_updated));
    let currentMonth = getMonthName(new Date(result.current.last_updated));
    let secondDay = getDayName(new Date(result.forecast.forecastday[1].date));
    let thirdDay = getDayName(new Date(result.forecast.forecastday[2].date));
    
    forecastContainer.innerHTML = `
            
            <div class="today forecast col-md-4">
                    <div class="forecast-box">
                      <div
                        class="forecast-header d-flex justify-content-between p-2"
                        id="today"
                      >
                        <div class="day">${currentDay}</div>
                        <div class="date">${DayOfMonth} ${currentMonth}</div>
                      </div>
        
                      <div class="forecast-content p-4" id="current">
                        <div class="location">${result.location.name}</div>
                        <div
                          class="degree d-flex justify-content-between align-items-center"
                        >
                          <div class="num">${result.current.temp_c}<sup>o</sup>C</div>
        
                          <div class="forecast-icon">
                            <img
                              src="https://${result.current.condition.icon}"
                              alt=""
                              width="90"
                            />
                          </div>
                        </div>
                        <div class="custom">${result.current.condition.text}</div>
                        <span class="d-inline-block px-2"><img src="./images/icon-umberella.png" alt="umberella icon" /> ${result.current.humidity}%</span>
                        <span class="d-inline-block px-2"><img src="./images/icon-wind.png" alt="wind icon" /> ${result.current.gust_kph}km/h</span>
                        <span class="d-inline-block px-2"><img src="./images/icon-compass.png" alt="compass icon" /> ${result.current.wind_dir}</span>
                      </div>
                    </div>
                  </div>
                  <div class="forecast-middle col-md-4 text-center">
                    <div class="forecast-box">
                      <div class="forecast-header middle p-2">
                        <div class="day">${secondDay}</div>
                      </div>
        
                      <div class="forecast-content p-4">
                        <div class="forecast-icon py-3">
                          <img
                            src="https://${result.forecast.forecastday[1].day.condition.icon}"
                            alt=""
                            width="48"
                          />
                        </div>
                        <div class="degree">${result.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>C</div>
                        <small>${result.forecast.forecastday[1].day.mintemp_c}<sup>o</sup></small>
                        <div class="custom">${result.forecast.forecastday[1].day.condition.text}</div>
                      </div>
                    </div>
                  </div>
                  <div class="forecast col-md-4 text-center">
                    <div class="forecast-box">
                      <div class="forecast-header p-2">
                        <div class="day">${thirdDay}</div>
                      </div>
        
                      <div class="forecast-content p-4">
                        <div class="forecast-icon py-3">
                          <img
                            src="https://${result.forecast.forecastday[2].day.condition.icon}"
                            alt=""
                            width="48"
                          />
                        </div>
                        <div class="degree">${result.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>C</div>
                        <small>${result.forecast.forecastday[2].day.mintemp_c}<sup>o</sup></small>
                        <div class="custom">${result.forecast.forecastday[2].day.condition.text}</div>
                      </div>
                    </div>
                  </div>
            
            `;
  }
}

//get data according to the region function and then print it using print function
async function getData(region) {
  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=d43b2523a75c48d893b103231240301&days=3&q=${region}`
  );
  result = await response.json();
  printData(result);
}

//get the location of the user function
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

//use the user location and print it using getUserLocation function and printData function
async function printCurrentLocation() {
  const userPosition = await getUserLocation();
  const { latitude, longitude } = userPosition.coords;
  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=d43b2523a75c48d893b103231240301&q=${latitude},${longitude}&days=3`
  );
  result = await response.json();
  printData(result);
}

printCurrentLocation();
