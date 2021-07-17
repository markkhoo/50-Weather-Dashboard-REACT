import { React, useState, useEffect } from "react";
import Header from "./components/header/header";

import './App.css';

function App() {
  const [getCity, setCity] = useState([]);

  const writeCity = event => {
    setCity(event.target.value.toLowerCase());

    // console.log(getCity);
  };

  const submitCity = event => {
    event.preventDefault();

    // console.log("city submitted");
  };

  return (
    <div>
      <Header />

      <form
        onSubmit={submitCity}
      >
        <input
          type="text"
          onChange={writeCity}

          placeholder="San Francisco"
        />
      </form>

    </div>
  );
}

export default App;
