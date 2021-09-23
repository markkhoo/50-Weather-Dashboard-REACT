import { React, useState, useEffect } from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import API from "./utils/API";

import './App.css';

function App() {
  const [getCity, setCity] = useState("");
  const [getUnit, setUnit] = useState("imperial");
  const [getStor, setStor] = useState([]);
  const [getData, setData] = useState({
    name: "San Francisco",
    dt: 0,
    main: {
      temp: "",
      humidity: ""
    },
    weather: {
      description: "",
      icon: "",
      id: "",
      main: ""
    },
    coord: {
      lat: 0,
      lon: 0
    }
  });
  const [getDat2, setDat2] = useState({
    current: { uvi: 0 },
    daily: [
      { 
        dt: 0,
        temp: {
          max: 100,
          min: 0
        }
      }
    ]
  });

  useEffect(() => {

    // Fills in city in Local Storage if none exists
    if (!localStorage.getItem("last_city")) {
      localStorage.setItem("last_city", JSON.stringify("San Francisco"));
    };
    setCity(JSON.parse(localStorage.getItem("last_city")));

    // Initiallizes the recent cities buttons
    let searches = JSON.parse(localStorage.getItem("stored_searches"));
    setStor(searches);

  }, []);

  useEffect(() => {

    findWeather(JSON.parse(localStorage.getItem("last_city")), getUnit);

    // Adds Recent Search if empty
    if (!(localStorage.getItem("stored_searches"))) {
      localStorage.setItem("stored_searches", JSON.stringify(["San Francisco"]));
    };

  }, [getUnit]);

  //
  useEffect(() => {
    console.log(getData, timeConverter(getData.dt), getDat2)
  }, [getData, getDat2])

  const findWeather = (city, units, forceSearch = 0) => {
    if (city && !forceSearch) {

      API.searchCity(city, units).then(res => {
        // Store last search at valid search event
        if (city !== "") {
          localStorage.setItem("last_city", JSON.stringify(res.data.name));
        };

        // Stores Recent Searches 
        if (!(JSON.parse(localStorage.getItem("stored_searches")).includes(res.data.name))) {
          let searchesArray = JSON.parse(localStorage.getItem("stored_searches"));
          searchesArray.push(res.data.name);
          localStorage.setItem("stored_searches", JSON.stringify(searchesArray));
          setStor(searchesArray);
        };

        setData(res.data);

        return res.data

      }).then(data => {

        // Borderline Callback Hell but only one time should be okay right?
        API.searchLatLon(`${data.coord.lat}`,`${data.coord.lon}`, units).then(res => {

          setDat2(res.data)

        }).catch(err => {
          console.log(err)
        })

      }).catch(err => {
        console.log(`"${city}" is an invalid input`, err);
      });

    };
  };

  const writeCity = event => {
    // This prevents queries by state and country.
    // Currently this site is not set up to search by state or country
    let cityOnly = event.target.value.replace(" ", "+").toLowerCase().split(",");
    setCity(cityOnly[0]);
  };

  const submitCity = event => {
    event.preventDefault();
    if (getCity !== JSON.parse(localStorage.getItem("last_city"))) {
      findWeather(getCity, getUnit);
    }
  };

  const changeUnits = () => {
    if (getUnit === "imperial") {
      setUnit("metric");
    } else if (getUnit === "metric") {
      setUnit("imperial");
    } else {
      setUnit("imperial");
    };
  };

  const displayUnits = () => {
    let answer = { temp: "", speed: "" };

    if (getUnit === "imperial") {
      answer.temp = "°F";
      answer.speed = "mph"
    } else if (getUnit === "metric") {
      answer.temp = "°C";
      answer.speed = "m/s"
    };
    // See https://openweathermap.org/current for Condition Codes

    return answer
  };

  const timeConverter = UNIX_timestamp =>{
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var day = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    // var time = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return `${month} ${day}, ${year}`;
    // function from second top answer in https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  }

  return (
    <div id="root-child">
      <Header />
      <div className="main">
        <div className="left-nav">

          <div className="search-container">
            <form onSubmit={submitCity} >
              <input
                type="text"
                onChange={writeCity}
                placeholder="San Francisco"
              />
              <input
                type="submit"
                value="Submit"
              />
            </form>
            <button type="button" onClick={changeUnits}>Change Units</button>
          </div>

          <div className="history-container">
            {getStor &&
              getStor.map(item => {
                return (
                  <button
                    key={item}
                    onClick={() => {
                      if (item !== JSON.parse(localStorage.getItem("last_city"))) {
                        findWeather(item, getUnit);
                      }
                    }}
                  >{item}</button>
                )
              })}
          </div>

        </div>

        <div className="right">
          <div className="current">
            <h1>{getData.name}</h1>
            <p>{timeConverter(getData.dt)}</p>
            <p>Tempurature: {getData.main.temp} {displayUnits().temp}</p>
            <p>Humidity: {getData.main.humidity}%</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
