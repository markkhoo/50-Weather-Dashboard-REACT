import { React, useState, useEffect } from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import API from "./utils/API";

import './App.css';

function App() {
  const [getCity, setCity] = useState("");
  const [getUnit, setUnit] = useState("imperial");
  const [getStor, setStor] = useState([]);

  useEffect(() => {

    // Fills in city in Local Storage if none exists
    if (!localStorage.getItem("last_city")) {
      localStorage.setItem("last_city", JSON.stringify("san francisco"));
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
      localStorage.setItem("stored_searches", JSON.stringify(["san francisco"]));
    };

  }, [getUnit]);

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
          searchesArray.push(city);
          localStorage.setItem("stored_searches", JSON.stringify(searchesArray));
          setStor(searchesArray);
        };

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
    if (getCity !== JSON.parse(localStorage.getItem("last_city"))){
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
                    if (item !== JSON.parse(localStorage.getItem("last_city"))) {
                      findWeather(item, getUnit);
                    }
                    // console.log(item);
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
