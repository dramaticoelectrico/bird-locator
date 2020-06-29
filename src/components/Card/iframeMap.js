/**
 *
 */
import { UtilityUrl } from "../../utils/utils";
import { Card } from "./card";

export const IframeMap = (function() {
  const iframeModal = document.getElementById("bird-map"),
    stage = document.getElementById("app"),
    info = document.getElementById("map--info");

  const showInfo = obj => {
    info.innerHTML = `<ul class="map__list">
            <li><b>Area:</b> ${obj.city}</li>
            <li><b>Bird:</b> ${obj.bird}</li></ul>`;
  };
  const activateMap = info => {
    stage.classList.add("content--shift");
    iframeModal.setAttribute("style", "display:block");
    iframeModal.setAttribute("aria-hidden", "false");
    showInfo(UtilityUrl(info));

    document
      .querySelector("iframe")
      .setAttribute(
        "style",
        "height:" +
          (document.body.offsetHeight -
            (document.querySelector(".map-content").offsetHeight + 75)) +
          "px"
      );
    setTimeout(() => {
      iframeModal.classList.add("menu-iframe--active");
    }, 600);
  };

  const iframeMap = {};
  iframeMap.removeIframe = () => {
    iframeModal.classList.remove("menu-iframe--active");
    iframeModal.setAttribute("aria-hidden", "true");
    stage.classList.remove("content--shift");

    setTimeout(() => {
      iframeModal.classList.remove("menu-iframe--active");
      iframeModal.setAttribute("style", "display:none");
      info.innerHTML = "";
      document.body.querySelector("iframe").remove();
    }, 600);
  };

  iframeMap.createLocationMap = url => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("frameborder", "0");

    iframe.setAttribute("src", url);
    iframeModal.append(iframe);
    activateMap(url);
  };

  return iframeMap;
})();
