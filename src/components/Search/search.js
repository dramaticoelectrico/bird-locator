import styles from "./search.css";
import { searchResult, currentLocation } from "../../global/eventEmitter";
import { Modal } from "../Modal/modal";

export function Search(city) {
  let input = document.querySelector("[name=city]");
  let inputSubmit = document.querySelector("[type=submit]");
  let preventScroll = false;
  let searchTerm;

  const SearchData = city;
  const searchForm = document.forms.search;
  const frag = document.createDocumentFragment();
  const ul = document.createElement("ul");
  const parent = document.querySelector(".typeahead");
  const clear = document.getElementById("clearInput");
  const listItems = ul.children || null;

  ul.setAttribute("class", "type-list");

  frag.appendChild(ul);
  parent.appendChild(frag);
  input.setAttribute("autocomplete", "off");
  input.setAttribute("data-latLng", "");
  searchForm.addEventListener("submit", submitFormData);
  input.addEventListener("keyup", getCityValue);

  input.addEventListener("keypress", function(e) {
    const keyCode = e.keyCode || e.which;
    if (!(keyCode === 13)) return;
    submitFormData(e);
  });

  clear.addEventListener("click", clearInput);

  function clearInput(e) {
    e.preventDefault();
    ul.innerHTML = "";
    input.value = "";
  }

  // add tab, enter, click events for list
  ul.addEventListener("click", function(e) {
    if (e.target.nodeName === "LI" || e.target.nodeName === "SPAN") {
      input.value =
        e.target.nodeName === "SPAN"
          ? e.target.parentNode.textContent
          : e.target.textContent;
      input.setAttribute("data-latLng", JSON.stringify(e.target.dataset));
      submitFormData(e);
    }
  });
  function getCityValue(e) {
    const keyCode = e.keyCode || e.which;

    searchTerm = new RegExp("^" + this.value, "i");

    if (this.value.length < 4) {
      ul.innerHTML = "";
      return;
    }

    const list = SearchData.filter(function(item) {
      return searchTerm.test(item.city);
    });
    ul.innerHTML = list.map(viewList).join("");

    if (listItems.length) {
      traverseList(listItems);
    }
    if (keyCode === 40 && listItems) {
      listItems[0].focus();
      input.value = listItems[0].textContent;
      input.setAttribute("data-latLng", JSON.stringify(listItems[0].dataset));
    }
  }
  function viewList(item) {
    let inputVal = new RegExp(input.value, "gi");
    let cityName = item.city.replace(
      inputVal,
      `<span class="HL">${input.value}</span>`
    );

    return `<li class="type-list__item" tabindex="0" data-lat="${
      item.latitude
    }" data-lon="${item.longitude}">${cityName}, ${item.state}</li>`;
  }
  function traverseList(list) {
    // list[0].focus();
    // input.value = list[0].textContent;
    Array.from(list).map((item, index) => {
      item.addEventListener("keyup", e => {
        const keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
          input.value = e.target.textContent;
          input.setAttribute("data-latLng", JSON.stringify(e.target.dataset));
        }
        if (keyCode === 13) {
          input.value = e.target.textContent;

          input.setAttribute("data-latLng", JSON.stringify(e.target.dataset));
          input.focus();
          inputSubmit.click();
        }
        if (keyCode === 40) {
          if (e.target.nextSibling === null) {
            list[0].focus();
            input.value = list[0].textContent;
            return;
          }
          e.target.nextSibling.focus();
          input.value = e.target.nextSibling.textContent;
          input.setAttribute(
            "data-latLng",
            JSON.stringify(e.target.nextSibling.dataset)
          );
        }
        if (keyCode === 38) {
          if (e.target.previousSibling === null) {
            input.focus();
            return;
          }
          e.target.previousSibling.focus();
          input.value = e.target.previousSibling.textContent;
          input.setAttribute(
            "data-latLng",
            JSON.stringify(e.target.previousSibling.dataset)
          );
        }
      });
    });
  }
  function submitFormData(e) {
    e.preventDefault();

    const location = input.value.trim();
    if (!errorHandler(location)) return true;
    const geoLocation = input.dataset.latlng
      ? JSON.parse(input.dataset.latlng)
      : null;
    //dispatch event, data

    searchResult.emit("SEARCH:RESULT", {
      name: input.value,
      zip: location,
      geo: geoLocation
    });
    formReset();
  }
  const errorHandler = val =>
    val.length > 2 ||
    Modal.init({
      class: "modal--notify",
      type: "modal--error",
      overlay: true,
      autoClose: true,
      autoCloseDelay: 5000,
      text: `<b>${val ||
        "empty"}</b> search value? At least 3 characters please`
    });

  const formReset = () => {
    input.dataset.latlng = "";
    document.forms.search.reset();
    ul.innerHTML = "";
  };
}
export function formAnimation() {
  const form = document.forms.search;
  const textInst = document.querySelector(".search-note");
  const input = form.querySelector(".search__input");

  form.classList.add("active");
  form.addEventListener("transitionend", e => {
    if (e.propertyName === "width") {
      textInst.classList.add("animate");
      input.focus();
    }
  });
}

export function searchModal(callback) {
  const modal = document.querySelector(".search-modal"),
    closeBtn = document.getElementById("search-modal--close");

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    modal.classList.add("active");
  }, 300);
  modal.addEventListener("transitionend", e => {
    if (e.propertyName === "transform") {
      callback && callback();
    }
  });
  closeBtn.addEventListener("click", function(e) {
    return searchModalCleanup();
  });
  document.body.classList.add("scroll--disabled");
  document.body.addEventListener("keyup", menuCloseKeyEvent);
}

export function searchModalCleanup() {
  const modal = document.querySelector(".search-modal");
  const form = document.forms.search;
  const typeList = form.querySelector(".type-list");
  const textInst = document.querySelector(".search-note");

  modal.setAttribute("aria-hidden", "true");
  //document.querySelector('[data-menu="search"]').focus();

  document.body.classList.remove("scroll--disabled");

  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.remove("show");
    form.classList.remove("active");
    textInst.classList.remove("animate");
    typeList.innerHTML = "";
    form.reset();
  }, 600);
  document.body.removeEventListener("keyup", menuCloseKeyEvent);
}
function menuCloseKeyEvent(e) {
  const keyCode = e.keyCode || e.which;
  if (keyCode === 27) {
    return searchModalCleanup();
  }
}
