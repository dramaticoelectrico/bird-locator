import {
  searchModal,
  formAnimation,
  searchModalCleanup
} from "../Search/search";
import { getSearchResults } from "../../index.js";
import { Saved } from "../Saved/saved";

const navigation = document.getElementById("menu");
const btns = navigation.querySelectorAll("button");

export function resetActiveState() {
  btns.forEach(item => item.classList.remove("active__menu-item"));
}
export function Menu() {
  navigation.addEventListener("click", function(e) {
    if (e.target.nodeName === "BUTTON") {
      if (
        e.target.classList.contains("active__menu-item") &&
        e.target.dataset.menu === "geolocation"
      )
        return;

      resetActiveState();
      e.target.classList.add("active__menu-item");
      e.target.focus();

      menuOpen({ select: e.target.dataset.menu, settings: null });
    }
  });
}
function menuOpen(item) {
  const menu = item.select;
  const searchOpen = document.querySelector(".search-modal.show.active");
  const saveOpen = document.querySelector(".menu-saved--active");

  switch (menu) {
    case "search":
      if (searchOpen) return;
      if (saveOpen) Saved.menuCleanUp();
      searchModal(formAnimation);
      break;
    case "geolocation":
      if (saveOpen) Saved.menuCleanUp();
      getSearchResults("geo");
      break;
    case "saved":
      if (saveOpen) return;
      if (searchOpen) searchModalCleanup();
      Saved.buildMenu();
      break;
    default:
      searchModal(formAnimation);
      break;
  }
}
