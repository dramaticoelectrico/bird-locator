import { currentLocation } from "../global/eventEmitter";
import { Modal } from "../components/Modal/modal";
window.dataLayer = window.dataLayer || {};
export const formatReverseGeo = function(data) {
  if (data.status.message !== "OK") {
    console.error("the status is wrong add error fn");
    return;
  }
  console.log(data.results[0]);
  const area = data.results[0].components;
  //   const address = data.results[0].address_components;
  const lon = data.results[0].geometry.lng,
    lat = data.results[0].geometry.lat;
  const addressObject = {
    route: area.suburb || "birds way",
    name: area.neighbourhood || area.suburb || area.city || "birdsville USA",
    city: area.city || "birdsville",
    country: area.country || "planet bird",
    state: area.state || "Bird Republic",
    zip: area.postcode || "",
    saved: false,
    geo: { lat, lon }
  };
  console.log(addressObject);
  window.dataLayer = addressObject;
  currentLocation.emit("SHOW:LOCATION", addressObject);
  return addressObject;
};

export const formatIpData = function(location) {
  const currentCity = {
    saved: false,
    name: location.city || "Bird Town USA",
    zip: location.zip || "19403",
    geo: { lat: location.lat || "40.1279", lon: location.lon || "-75.4319" },
    country: location.country || "USA",
    state: location.regionName || "Audubon, Pennsylvania"
  };
  return currentCity;
};

export const truncate = function(str) {
  if (str.length <= 20) return str;
  let arr = str.replace(/[^\w\s]/gi, "").split("");
  const newStr = arr.reduce((acc, item) => {
    if (acc.length <= 20) {
      acc.push(item);
    }
    return acc;
  }, []);
  return newStr.slice(0, newStr.lastIndexOf(" ")).join("");
};

export const UtilityUrl = str => {
  const info = str.split("=").slice(1);
  const city = decodeURIComponent(info[0].replace(/&lat/, ""));
  const bird = decodeURIComponent(info[info.length - 1]);
  return { city, bird };
};
