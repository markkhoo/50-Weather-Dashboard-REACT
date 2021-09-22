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
    main: {
      temp: "",
      humidity: ""
    },
    weather: {
      description: "",
      icon: "",
      id: "",
      main: ""
    }
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
    console.log(getData)
  }, [getData])

  const findWeather = (city, units, forceSearch = 0) => {
    if (city && !forceSearch) {

      API.searchCity(city, units).then(res => {
        // Store last search at valid search event
        if (city !== "") {
          localStorage.setItem("last_city", JSON.stringify(city));
        };

        // Stores Recent Searches 
        if (!(JSON.parse(localStorage.getItem("stored_searches")).includes(city))) {
          let searchesArray = JSON.parse(localStorage.getItem("stored_searches"));
          searchesArray.push(res.data.name);
          localStorage.setItem("stored_searches", JSON.stringify(searchesArray));
          setStor(searchesArray);
        };

        // console.log(res.data);
        setData(res.data);

      }).catch(err => {
        console.log(`"${city}" is an invalid input`);
        console.log(err);
      });

    };
  };

  const writeCity = event => {
    setCity(event.target.value.replace(" ", "+").toLowerCase());
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
