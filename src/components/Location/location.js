import styles from "./location.css";
import { searchResult } from "../../global/eventEmitter";

window.dataLayer = window.dataLayer || {};
const currentSearch = document.getElementById("location");

export const setCurrentLocation = function(currentLocation) {
  window.dataLayer = currentLocation;
  localStorage.setItem("saved", JSON.stringify([currentLocation]));
  return currentLocation;
};
export const renderIntroSelections = function(currentLocation) {
  const buttonGroup = `
        <button id="intro-button" data-search="intro-current" class="button button--styleA center-block">Search birds in ${
          currentLocation.name
        }</button>
    `;
  return buttonGroup;
};
export const eventsIntroSelections = (function() {
  const parent = document.getElementById("intro");

  const eventsIntroSelections = {};

  function eventsIntroButtons(e) {
    e.preventDefault();
    if (e.target.id === "intro-button") {
      setLocation();
    }
  }
  eventsIntroSelections.removeEvents = function() {
    if (parent.children.length === 0) return;
    parent.removeAttribute("aria-haspopup");
    parent.removeAttribute("style");
    parent.classList.remove("intro--active");
    parent.children[0].remove();
    parent.removeEventListener("click", eventsIntroButtons);
  };
  eventsIntroSelections.bindEvents = function() {
    parent.setAttribute("style", "display:block");
    setTimeout(() => {
      parent.classList.add("intro--active");
      parent.setAttribute("aria-haspopup", "true");
      parent.addEventListener("click", eventsIntroButtons);
    }, 800);
  };
  return eventsIntroSelections;
})();
export const renderCurrentLocation = function(currentLocation) {
  let template = `<h1 class="location-city">${
    currentLocation.types === "postal_code"
      ? currentLocation.city
      : currentLocation.name
  }</h1>
        <p class="location-city-detail">${currentLocation.country}, ${
    currentLocation.state
  }, ${currentLocation.zip}</p>
        `;
  if (currentLocation.locationName) {
    template += `<p class="location-city-locationID">${
      currentLocation.locationName
    }</p>`;
  }
  currentSearch.innerHTML = template;
  document.getElementById("intro").innerHTML = renderIntroSelections(
    currentLocation
  );
};
export const setLocation = function() {
  const locationData = JSON.parse(localStorage.getItem("saved"));
  searchResult.emit("SEARCH:RESULT", locationData[0]);
};
