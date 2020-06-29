import { searchModalCleanup } from "./../Search/search";

const el = document.getElementById("indicator");

const exitIndicator = () => removeIndicator();

const removeIndicator = function(callback) {
  el.classList.remove("indicator--searching");
  window.scrollTo(0, 0);
  setTimeout(() => {
    el.removeAttribute("style", "display:block");
  }, 500);
  callback && callback();
};
const showIndicator = function() {
  el.setAttribute("style", "display:block");
  setTimeout(() => {
    el.classList.add("indicator--searching");
  }, 500);
};
export const indicator = (status = false, callback = null) => {
  return status ? showIndicator() : removeIndicator(callback);
};

el.addEventListener("click", exitIndicator);
