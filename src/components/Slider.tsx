import React from "react";
import "../App.css";

function Slider() {
  const root = document.querySelector<HTMLHtmlElement>(":root");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const images = document.querySelectorAll<HTMLImageElement>(".image");

    if (root) {
      root.style.filter = `hue-rotate(${event.target.value}deg)`;
    }

    images.forEach((image: HTMLImageElement) => {
      image.style.filter = `hue-rotate(${-event.target.value}deg)`;
    });
  }

  return (
    <input
      type="range"
      min="1"
      max="360"
      defaultValue="1"
      className="slider"
      onChange={handleChange}
    />
  );
}

export default Slider;
