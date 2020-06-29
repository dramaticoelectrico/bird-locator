import "whatwg-fetch";
import styles from "./global/global.css";
import cities from "../assets/cities.json";
import Promise from "promise-polyfill";
import { savedlocation } from "./config";
import { indicator } from "./components/Indicator/indicator";
import {
  searchResult,
  menuSelect,
  currentLocation,
  searchResolved
} from "./global/eventEmitter";
import {
  Search,
  searchModal,
  formAnimation,
  searchModalCleanup
} from "./components/Search/search";
import { Menu, Test } from "./components/Menu/menu";

import { Card } from "./components/Card/card";
import { IframeMap } from "./components/Card/iframeMap";
import { Slider } from "./components/Slider/slider";
import { Instructor } from "./components/Instructor/instructor";
import {
  setCurrentLocation,
  renderCurrentLocation,
  renderIntroSelections,
  eventsIntroSelections
} from "./components/Location/location";

import {
  getReverseGeoLocation,
  getBirdLocationData,
  getGeoLocation,
  getIpLocation
} from "./services/services";

const root = window.location.href;
const api = `${root}assets/cities.min.json`;

function GetCity(apiPath) {
  const cityList = fetch(apiPath)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));

  return cityList;
}
const GetUsCities = file => Promise.resolve(file);
GetUsCities(cities).then(Search);

Menu();

export const getSearchResults = function(data) {
  indicator(true);
  if (document.querySelector(".instructor--active")) {
    Instructor.removeHelpers(document.querySelectorAll(".instructor"));
  }
  if (data === "geo") {
    getGeoLocation();
    return;
  }
  //TODO: add call to location ID next
  if (data.lat || data.saved) {
    getBirdLocationData(data);
    renderCurrentLocation(data);
    return;
  }
  getReverseGeoLocation(data);
};

searchResult.subscribe("SEARCH:RESULT", getSearchResults);
searchResult.subscribe("GEO:CHANGE", getReverseGeoLocation);
currentLocation.subscribe("SHOW:LOCATION", renderCurrentLocation);

//MAP MODAL
document
  .getElementById("remove__iframe")
  .addEventListener("click", IframeMap.removeIframe);

// on page load city data
if (savedlocation() && savedlocation()[0].saved) {
  // get birds with local storage data by default
  window.dataLayer = savedlocation()[0];
  renderCurrentLocation(savedlocation()[0]);
  eventsIntroSelections.bindEvents();
} else {
  // never been here before
  Instructor.createElements(document.querySelectorAll("[data-instructor]"), {
    autoclose: false,
    timer: 5000,
    bubbleLocation: "top"
  });

  getIpLocation()
    .then(response => setCurrentLocation(response))
    .then(currentCity => renderCurrentLocation(currentCity))
    .then(eventsIntroSelections.bindEvents());

  // then render buttons
  Instructor.showHelpers(document.querySelectorAll(".instructor"));
}

export const RenderView = (function() {
  let index = 0;
  const renderview = {};

  let cardView = document.getElementById("cards");

  renderview.buildCards = function(data) {
    index++;
    var images = data.images;
    var item = document.createElement("section");
    item.setAttribute("id", "card-" + index);
    item.setAttribute("class", "card");

    cardView.appendChild(item);
    this.buildImageGallery(index, images);
    this.buildCardDetails(index, data);
  };
  renderview.buildImageGallery = function(index, imageArray) {
    Slider.create(
      {
        el: "#gallery-" + index,
        id: index,
        index: index,
        images: imageArray,
        width: 300,
        height: 230,
        style: "slider"
      },
      "card-" + index
    );
  };
  renderview.buildCardDetails = function(index, data) {
    Card.init(index, data);
  };
  return renderview;
})();
