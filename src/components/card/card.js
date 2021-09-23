import React from "react";

import './card.css';

function Card(props) {
    const iconAltText = code => {
        if (code === "01d" || code === "01n") {
            return `clear sky weather icon`
        } else if (code === "02d" || code === "02n") {
            return `few clouds weather icon`
        } else if (code === "03d" || code === "03n") {
            return `scattered clouds weather icon`
        } else if (code === "04d" || code === "04n") {
            return `broken clouds weather icon`
        } else if (code === "09d" || code === "09n") {
            return `shower rain weather icon`
        } else if (code === "10d" || code === "10n") {
            return `rain weather icon`
        } else if (code === "11d" || code === "11n") {
            return `thunderstorm weather icon`
        } else if (code === "13d" || code === "13n") {
            return `snow weather icon`
        } else if (code === "50d" || code === "50n") {
            return `mist weather icon`
        } else {
            return `weather icon`
        }
    };

    return(
        <div className="card" >
            <img 
                src={`http://openweathermap.org/img/wn/${props.icon}@2x.png`}
                alt={iconAltText(props.icon)}
            />
            <p className="bold-font" >{props.date}</p>
            <p>Temp: {props.temp}</p>
            <p>Humidity: {props.humidity}</p>
        </div>
    )
};

export default Card;