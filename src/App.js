import { React, useState, useEffect } from "react";
import HistoryButton from "./components/history_button/history_button";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import API from "./utils/API";

import './App.css';

function App() {
  const [getCity, setCity] = useState("");
  const [getUnit, setUnit] = useState("imperial");

  useEffect(() => {
    let lastCity = JSON.parse(localStorage.getItem("last_city"));

    if (lastCity !== (null)) {
      findWeather(lastCity, getUnit);
    } else {
      localStorage.setItem("last_city", JSON.stringify("San Francisco"));
      findWeather("San Francisco", getUnit);
    };
  }, []);

  const findWeather = (city, units) => {
    if (city) {

      API.searchCity(city, units).then(res => {
        // Store last search at valid search event
        if (city !== "") {
          localStorage.setItem("last_city", JSON.stringify(city));
        }

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
