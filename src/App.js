import { React, useState, useEffect } from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import API from "./utils/API";

import './App.css';

function App() {
  const [getCity, setCity] = useState("");
  const [getUnit, setUnit] = useState("imperial");
  const [getStor, setStor] = useState([]);
  const [getFlag, setFlag] = useState(0);

  // This useEffect runs when the page initiallizes
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

    // Queue for flag change
    changeFlag();

  }, []); // The empty array here is important so the useEffect doesn't run again

  // This useEffect stores recent searches into a state and update on flag change
  useEffect(() => {

    //
    let searches = JSON.parse(localStorage.getItem("stored_searches"));
    setStor(searches);

  }, [getFlag]);

  const findWeather = (city, units) => {
    if (city && !(city === JSON.parse(localStorage.getItem("last_city")))) {

      API.searchCity(city, units).then(res => {
        // Store last search at valid search event
        if (city !== "") {
          localStorage.setItem("last_city", JSON.stringify(city));
        };

        // Store into recent Searches
        if (!(JSON.parse(localStorage.getItem("stored_searches")).includes(city))) {
          let searchesArray = JSON.parse(localStorage.getItem("stored_searches"));
          searchesArray.push(city);
          localStorage.setItem("stored_searches", JSON.stringify(searchesArray));
        };

        // Queue for flag change
        changeFlag();

        //
        console.log(res.data);
      }).catch(err => {
        console.log(`"${city}" is an invalid input`);
        console.log(err);
      });

    };
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

  const changeFlag = () => {
    let randomInt = Math.floor(Math.random() * 10) + 1;
    setFlag(randomInt);
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
            {getStor.map(item => {
              return (
                <button
                  key={item}
                  onClick={() => {
                    findWeather(item, getUnit);
                    console.log(item);
                  }}
                >{item}</button>
              )
            })}
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
