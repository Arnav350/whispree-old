import React, { useRef } from "react";
import "../App.css";

function Slider() {
  const sliderClass = useRef<HTMLInputElement>(null!);
  const root = document.querySelector<HTMLHtmlElement>(":root");

  function handleChange(value: string) {
    const images = document.querySelectorAll<HTMLImageElement>(".image");

    if (root) {
      root.style.filter = `hue-rotate(${value}deg)`;
    }

    images.forEach((image: HTMLImageElement) => {
      image.style.filter = `hue-rotate(${-value}deg)`;
    });
  }

  return (
    <input
      type="range"
      min="1"
      max="360"
      className="slider"
      ref={sliderClass}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}

export default Slider;
