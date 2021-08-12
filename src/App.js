import { React, useState, useEffect } from "react";
import HistoryButton from "./components/history_button/history_button";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import API from "./utils/API";

import './App.css';

function App() {
  const [getCity, setCity] = useState("");
  const [getUnit, setUnit] = useState("imperial");
  // const [getStor, setStor] = useState([]);

  useEffect(() => {

    // Checks Last City
    if (localStorage.getItem("last_city")) {
      findWeather(JSON.parse(localStorage.getItem("last_city")), getUnit);
    } else {
      localStorage.setItem("last_city", JSON.stringify("san francisco"));
      findWeather("san francisco", getUnit);
    };

    // Adds Recent Search if empty
    if (!(localStorage.getItem("stored_searches"))) {
      localStorage.setItem("stored_searches", JSON.stringify(["san francisco"]));
    };

  }, []);

  const findWeather = (city, units) => {
    if (city) {

      API.searchCity(city, units).then(res => {
        // Store last search at valid search event
        if (city !== "") {
          localStorage.setItem("last_city", JSON.stringify(city));
        };

        // Store into recent Searches
        console.log(JSON.parse(localStorage.getItem("stored_searches")));

        if (!(JSON.parse(localStorage.getItem("stored_searches")).includes(city))) {
          let searchesArray = JSON.parse(localStorage.getItem("stored_searches"));
          searchesArray.push(city);
          localStorage.setItem("stored_searches", JSON.stringify(searchesArray));
        };

        //
        console.log(res.data);
      }).catch(err => {
        console.log(`"${city}" is an invalid input`);
        console.log(err);
      });

    } else {
      console.log("invalid input")
    }
  };

  const writeCity = event => {
    setCity(event.target.value.toLowerCase());
  };

  const submitCity = event => {
    event.preventDefault();
    findWeather(getCity, getUnit);
  };

  const changeUnits = () => {
    if (getUnit === "imperial") {
      setUnit("metric");
    } else if (getUnit === "metric") {
      setUnit("imperial");
    } else {
      setUnit("imperial");
    };
    findWeather(JSON.parse(localStorage.getItem("last_city")), getUnit);
  };

  return (
    <div id="root-child">
      <Header />
      <div className="main">
        <div className="left-col">
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
            <HistoryButton />
          </div>

        </div>
        <div className="right">

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
