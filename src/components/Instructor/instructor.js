import styles from "./instructor.css";

export const Instructor = (function() {
  const defaults = {
    autoclose: true,
    timer: 5000,
    bubbleLocation: "top"
  };
  const cleanUp = e => {
    let target = e.target;
    if (e.animationName === "slideOutDown") {
      target.classList.remove("instructor--active");
      target.classList.remove("instructor--exit");
      target.classList.add("hidden");
      target.removeEventListener("animationend", cleanUp);
      target.remove();
    }
  };
  const addAnimations = item => {
    const settings = item.dataset;
    item.classList.remove("hidden");
    setTimeout(() => {
      item.classList.add("instructor--active");
    }, 300);

    if (settings.autoclose === "true") runAutoClose(item);
  };
  const removeAnimations = item => {
    item.classList.add("instructor--exit");
    item.addEventListener("animationend", cleanUp);
  };
  const runAutoClose = item => {
    setTimeout(() => {
      removeAnimations(item);
    }, 5000);
  };
  const instructor = {};

  instructor.createElements = function(tip, settings) {
    const config = Object.assign({}, defaults, settings);

    tip.forEach((item, index) => {
      let parentArea = item.getClientRects();
      let frag = document.createDocumentFragment();
      // custom width / height
      const tmpl = document.createElement("div");
      tmpl.textContent = item.dataset.instructor;
      tmpl.setAttribute("class", `instructor instructor-${index}`);
      tmpl.setAttribute("data-autoclose", config.autoclose);
      tmpl.setAttribute("data-bubbleLocation", config.bubbleLocation);
      tmpl.setAttribute(
        "style",
        `left:-10px; width:${parentArea[0].width + 20}px; top:-${parentArea[0]
          .height + 25}px; right:${parentArea[0].right}px;`
      );
      tmpl.classList.add("hidden");
      frag.append(tmpl);

      item.append(frag);
    });
  };
  instructor.showHelpers = function(el) {
    Array.from(el).map(addAnimations);
  };
  instructor.removeHelpers = function(el) {
    Array.from(el).map(removeAnimations);
  };
  return instructor;
})();
