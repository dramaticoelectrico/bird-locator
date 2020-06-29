import "whatwg-fetch";
import { RenderView } from "../index";
import { indicator } from "./../components/Indicator/indicator";
import { searchModalCleanup } from "./../components/Search/search";
import { searchResult, searchResolved } from "../global/eventEmitter";
import { formatIpData, formatReverseGeo } from "../utils/utils";
import { Modal } from "../components/Modal/modal";
import { eventsIntroSelections } from "../components/Location/location";
console.log(process.env.KEY_FLICKR, "===================");
const FLICKR_KEY = process.env.KEY_FLICKR;
const KEY_GMAPS = process.env.KEY_GMAPS;

/* ===== ERRORS ====== */
export function fetchErrorHandler(response) {
  if (!response.ok || !response) {
    throw Error(response.statusText);
  }
  return response;
}
export function viewError(msg, searchTerm) {
  console.error(`${msg} was sent in error${searchTerm}`);
  indicator(false);
  Modal.init({
    class: "modal--notify",
    type: "modal--error",
    autoClose: true,
    autoCloseDelay: 5000,
    text: `${searchTerm} : returned no birds. Try again`
  });
}

/* ===== PAGE LOAD FUNCTIONS LOCATION ====== */
export const getIpLocation = function() {
  if (/^https:$/.test(location.protocol)) {
    const dummydata = Promise.resolve(formatIpData({}));
    return dummydata;
  }
  return fetch("http://ip-api.com/json")
    .then(fetchErrorHandler)
    .then(response => response.json())
    .then(data => formatIpData(data))
    .catch(error => viewError(response, data));
};

export const getBirdLocationData = function(coords) {
  const api = `https://2y5m12ys04.execute-api.us-east-2.amazonaws.com/dev?lng=${
    coords.geo.lon
  }&lat=${coords.geo.lat}`;
  return fetch(api)
    .then(response => response.json())
    .then(data => sendCollection(newCollection(data)))
    .then(indicator(false, searchModalCleanup))
    .catch(error => console.log(error));
};

export const newCollection = function(data) {
  const stage = document.getElementById("cards");
  // test logic for new data
  // not found return empty array
  if (!data.length) {
    // launch dialog
    indicator(false);
    Modal.init({
      class: "modal--notify",
      type: "modal--error",
      overlay: false,
      autoClose: true,
      button: false,
      autoCloseDelay: 3000,
      text: `${data.length} results were returned.`
    });
    return;
  }
  eventsIntroSelections.removeEvents();
  stage.innerHTML = "";
  return data;
};
// STEP 2 - send bird array to get images for each bird
export const sendCollection = collection =>
  Promise.resolve(collection.forEach(item => assembleBirdCards(item)));

// STEP 3 - send object to function that adds images FLICKR API CALLS
export const assembleBirdCards = function(ObjItem) {
  return fetch(
    `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_KEY}&per_page=5&tags=${encodeURIComponent(
      ObjItem.comName
    )}&format=json&nojsoncallback=1`
  )
    .then(fetchErrorHandler)
    .then(response => response.json())
    .then(data => getImage(data, ObjItem))
    .then(data => RenderView.buildCards(data))
    .catch(error => viewError(error, data));
};
// STEP 4 -- make object add bird images
export const getImage = function(item, bird) {
  // catch 'stat.ok' / item.photos.photo // test function
  const photo = item.photos.photo;
  const images =
    photo.length > 0
      ? photo.map(
          item =>
            `<img src="http://farm${item.farm}.staticflickr.com/${
              item.server
            }/${item.id}_${item.secret}_n.jpg" alt="" title="${item.title}" />`
        )
      : ['<img src="https://unsplash.it/300/250?image=652" alt=""/>'];
  const imageCollection = Object.assign(bird, {
    images
  });
  return imageCollection;
};

/* ========= REVERSE GEOLOCATION ========== */
export const getReverseGeoLocation = function(address) {
  const format =
    address.geo !== null
      ? `${address.geo.lat},${address.geo.lon}`
      : `${address.name}`;
  fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${format}&key=${KEY_GMAPS}`
  )
    .then(fetchErrorHandler)
    .then(response => response.json())
    .then(data => formatReverseGeo(data))
    .then(currentCity => getBirdLocationData(currentCity))
    .catch(response => viewError(response, format));
};

/* ===== GEO - LOCATION ====== */
export const getGeoLocation = function() {
  let error,
    success,
    geo = {};
  if (!navigator.geolocation) return;

  error = function() {
    indicator(false);
    Modal.init({
      class: "modal--notify",
      type: "modal--error",
      overlay: false,
      autoClose: true,
      button: false,
      autoCloseDelay: 3000,
      text: `Geolocation is not working. Probably due to lack of secure https connection.`
    });
    throw "error no geolocation";
  };

  success = function(position) {
    geo.lat = position.coords.latitude;
    geo.lon = position.coords.longitude;

    searchResult.emit("GEO:CHANGE", {
      name: `${geo.lat},${geo.lon}`,
      zip: null,
      geo
    });
  };

  navigator.geolocation.getCurrentPosition(success, error);
};
