import styles from "./card.css";
import { searchResult } from "../../global/eventEmitter";
import { checkSavedLocation } from "../../index";
import { Modal } from "../Modal/modal";
import { IframeMap } from "./iframeMap";

window.dataLayer = window.dataLayer || {};
export const Card = (function() {
  const card = {};
  card.init = function(id, data) {
    let target,
      desk,
      drawer,
      hiddenEl,
      displayEl,
      displayElHeight,
      hiddenElHeight,
      button,
      saveBtn,
      currentItem,
      iframeModal,
      saved,
      map,
      mergeLocation,
      saveArray = JSON.parse(localStorage.getItem("saved")),
      wrapper;

    iframeModal = document.getElementById("bird-map");
    saved = saveArray.map(item =>
      typeof item.locationId !== "undefined" ? item.locationId : ""
    );
    target = document.createElement("aside");
    target.setAttribute("id", "card-details-" + id);
    target.innerHTML = createTemplate(id, data);

    wrapper = document.getElementById("card-" + id);

    wrapper.insertAdjacentElement("beforeend", target);

    setUpDrawer();

    function attachEvents() {
      button = target.querySelector("[data-drawer=card-" + id + "]");
      saveBtn = target.querySelector(".button--save");
      button.addEventListener("click", toggleDrawer, false);
      saveBtn.addEventListener("click", saveLocation);
      map = target.querySelector(".button__anchor");
      map.addEventListener("click", createMap);
    }
    function createMap(e) {
      e.preventDefault();
      IframeMap.createLocationMap(e.target.href);
    }
    function saveLocation(e) {
      e.preventDefault();
      if (e.target.hasAttribute("disabled")) return;
      if (!saveArray) {
        saveArray = [];
      }
      mergeLocation = Object.assign(
        {},
        window.dataLayer,
        JSON.parse(e.target.dataset.save)
      );
      saveArray.unshift(mergeLocation);
      saved = saveArray.map(item =>
        typeof item.locationId !== "undefined" ? item.locationId : ""
      );
      localStorage.setItem("saved", JSON.stringify(saveArray));
      checkSavedLocations(saved);
    }
    function checkSavedLocations(saved) {
      const buttons = document.querySelectorAll(".button--save");

      buttons.forEach(item => {
        if (saved.indexOf(item.dataset.location) > -1) {
          item.setAttribute("disabled", "");
          item.textContent = "Saved";
        }
      });
      Modal.init({
        class: "modal--notify",
        type: "modal--success",
        autoClose: true,
        autoCloseDelay: 5000,
        text: `${mergeLocation.locationName} saved!`
      });
    }
    function toggleDrawer(e) {
      button.classList.toggle("drawer--active");
      if (drawer.classList.contains("drawer--open")) {
        drawer.classList.remove("drawer--open");
        drawer.setAttribute("style", "transform: translateY(0px)");
      } else {
        drawer.classList.add("drawer--open");
        drawer.setAttribute(
          "style",
          "transform: translateY(-" + hiddenElHeight + "px)"
        );
      }
    }

    function setUpDrawer() {
      displayEl = target.querySelector(".card--display");
      displayElHeight = displayEl.offsetHeight;

      hiddenEl = target.querySelector(".card--hidden");
      hiddenElHeight = hiddenEl.offsetHeight;

      desk = target.querySelector(".card-body");
      drawer = target.querySelector(".card-drawer");
      // add dom elements

      desk.setAttribute("style", "height:" + displayElHeight + "px");

      attachEvents();
    }
    function createTemplate(id, data) {
      const location = data.locName.replace(/'/g, "");
      const saveObj = JSON.stringify({
        saved: true,
        locationName: location,
        locationId: data.locID,
        geo: {
          lon: data.lng,
          lat: data.lat
        }
      });

      const tmpl = `<header class="card-body">
        <div class="card-drawer">
            <div class="card--display">
                <h3 class="card-title font-style--bold">${data.comName}</h3>
                <ul class="card-secondary list_font--secondary list--disc">
                    <li>${data.locName}</li>                  
                    <li>${data.obsDt}</li>
                    <li class="card-location--save">
                    <button 
                        class="button--save${
                          saved.indexOf(data.locID) > -1 ? " disabled" : ""
                        }" 
                        data-location="${data.locID}" 
                        data-save='${saveObj}'>${
        saved.indexOf(data.locID) > -1 ? "Saved" : "Save Location"
      }</button></li>                    
                </ul>
            </div>
            <div class="card--hidden">
                <ul class="list_font--secondary list--disc m1-NS">
                    <li>Scientific name <b>${data.sciName}</b></li>
                    <li class="list-status--${
                      data.obsValid
                    }">Valid observation</li>
                    <li class="list-status--${
                      data.locationPrivate
                    }">Private location</li>
                    <li><b>${data.howMany ||
                      "unlisted"}</b> Observed</li>                    
                    <li>Location ID: ${data.locID}</li>                  
                </ul>    
                        
            </div> 
        </div>
    </header>
    <footer class="card__footer p1-NS">
        <div class="map__link">
            <a class="button button__anchor" href="/map.html?q=${encodeURIComponent(
              data.locName
            )}&lat=${data.lat}&lng=${data.lng}&bird=${
        data.comName
      }"><span class="button--marker"></span></a>
            <span class="u-uppercase">Map it</span>
        </div>
        <button aria-label="show / secondary content" data-drawer="card-${id}" class="button button-drawer open-close-icon--rotate"><svg class="lnr lnr-cross lnr-card--open-close"><use xlink:href="#lnr-cross"></use></svg></button>
    </footer>`;
      return tmpl;
    }
  };
  return card;
})();
// pass in card ID eg. '0' - index: '0'
//CardDrawer.init(id, data);
