import { truncate } from "../../utils/utils";
import { savedlocation } from "../../config";
import { searchResult } from "../../global/eventEmitter";
import { Modal } from "../Modal/modal";

export const Saved = (function() {
  const menu = document.getElementById("menu-saved");
  const list = document.getElementById("menu-list");
  const stage = document.getElementById("app");
  const close = document.getElementById("close-save-menu");

  const saved = {};

  const closeMenu = () => {
    stage.classList.remove("content--shift");
    menu.classList.remove("menu-saved--active");
    menu.setAttribute("aria-hidden", "true");
    setTimeout(function() {
      menu.removeAttribute("style");
    }, 600);
    list.removeEventListener("click", sortEventActions);
  };
  const runEvents = () => {
    stage.classList.add("content--shift");
    menu.setAttribute("style", "display:block");
    menu.setAttribute("aria-hidden", "false");
    setTimeout(function() {
      menu.classList.add("menu-saved--active");
    }, 600);
  };
  const getSaved = item => item.saved === true;

  const createList = item => `
    <li class="menu-saved__list-item">
        <button class="button-menu-list menu-saved--search" data-geo=${JSON.stringify(
          item.geo
        )} data-locationGet="${item.locationId}">${truncate(
    item.locationName
  )}</button> 
        <button data-locationRemove="${
          item.locationId
        }" class="button-menu-list menu-saved--delete">
            <svg class="lnr lnr-cross-save-menu">
                    <title>Remove City</title>
                    <use xlink:href="#lnr-cross"></use>
            </svg>
        </button>
        </li>`;
  const removeItem = location => {
    const list = document.querySelector(`[data-locationremove="${location}"]`)
      .parentNode;
    list.classList.add("delete--active");
    const newMenu = savedlocation().filter(
      item => item.locationId !== location
    );
    localStorage.setItem("saved", JSON.stringify(newMenu));
  };

  const getLocation = location => {
    const saved = savedlocation().filter(
      item => item.locationId === location
    )[0];
    searchResult.emit("SEARCH:RESULT", saved);
    closeMenu();
  };

  const sortEventActions = e => {
    e.preventDefault();
    if (e.target.nodeName === "BUTTON") {
      e.target.dataset.locationget
        ? getLocation(e.target.dataset.locationget)
        : removeItem(e.target.dataset.locationremove);
    }
  };

  const attachMenuEvents = () => {
    list.addEventListener("click", sortEventActions);
    close.addEventListener("click", closeMenu);
  };

  saved.buildMenu = () => {
    // savedLocations localstorage array
    const savedLocations = savedlocation();
    if (savedLocations.length && !savedLocations[0].saved) {
      Modal.init({
        class: "modal--notify",
        type: "modal--info",
        autoClose: true,
        autoCloseDelay: 5000,
        text: `Saved searches go here but you don't have any`
      });
      //TODO: show empty menu
      return;
    }
    list.innerHTML = savedlocation()
      .filter(getSaved)
      .map(createList)
      .join("");
    runEvents();
    attachMenuEvents();
  };
  saved.menuCleanUp = () => closeMenu();

  return saved;
})();
