import axios from "axios";

const key = '22bb6e2db366aab8539ac22df7b32d3a';

const API = {
    searchCity: (city) => {
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${'imperial'}&appid=${key}`)
    }
};

export default API;