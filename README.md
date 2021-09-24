# Weather Dashboard

## Description

This is a simple Weather Dashboard with a 5-Day forecast that can be visited [HERE](https://markkhoo.github.io/50-Weather-Dashboard-REACT/). It is a spiritual successor to my [previous project](https://github.com/markkhoo/06-Weather-Dashboard). This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Weather data is fetched from [OpenWeatherMap](https://openweathermap.org/).

## How to Use
To search for weather, input a `city` in the form (specifiying city by state and country is currently not available). Recent cities searched by you are displayed underneath the form. You can switch from `Imperial` to `Metric` units using the `Change Units` button.

![Weather-Dashboard-Screenshot](./src/assets/READMEimage.png)

## Code Snippet
This section of code will save an "entry" of the searched city into local storage.
```Javascript
// Stores Recent Searches 
if (!(JSON.parse(localStorage.getItem("stored_searches")).includes(res.data.name))) {
    let searchesArray = JSON.parse(localStorage.getItem("stored_searches"));
    searchesArray.push(res.data.name);
    localStorage.setItem("stored_searches", JSON.stringify(searchesArray));
    setStor(searchesArray);
};
```
Line by line, the code does the following:
1. Validates whether the particular searched city has been searched already.
2. Pulls the recent storage into an array variable.
3. Adds the searched city to the end of that array.
4. Resets the local storage with the new array of cities.
5. Resets a React state with the new array of cities.

## Technologies Used
* [React.js](https://github.com/facebook/create-react-app)
* [Node.js](https://nodejs.org/en/docs/)
* JavaScript ES6
* HTML
* CSS