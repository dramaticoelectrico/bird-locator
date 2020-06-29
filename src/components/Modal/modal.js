import styles from "./modal.css";

export const Modal = (function() {
  const defaults = {
    class: "model",
    type: "alert",
    theme: "modal-theme--berzerk",
    textEl: document.createElement("p"),
    textId: "dialog--action",
    textClass: "modal-text",
    button: true,
    autoClose: false,
    autoCloseDelay: 4000,
    overlay: true, //always make for click away close - false is transparent
    text: `Info Message`
  };
  let config,
    text,
    modal,
    button,
    overlay = document.createElement("span"),
    fragment = document.createDocumentFragment();

  function showModal() {
    window.getComputedStyle(modal).height;

    overlay.classList.add("overlay--open");
    overlay.setAttribute("style", "z-index:8");
    modal.classList.add("modal--open");
    modal.setAttribute("style", "z-index:9");
    modal.focus();
  }

  function close() {
    overlay.classList.remove("overlay--open");
    overlay.removeAttribute("style");
    modal.classList.remove("modal--open");
    modal.removeAttribute("style");

    modal.addEventListener("transitionend", function(e) {
      this.remove();
    });
    overlay.addEventListener("transitionend", function(e) {
      this.remove();
    });
    document.body.removeEventListener("keyup", removeModalDialog);
  }
  function removeModalDialog(e) {
    let keycode = e.keyCode || e.which;
    if (keycode === 27 && modal && overlay) {
      close();
    }
  }

  function autoClose(n) {
    if (!modal && !overlay) return;
    setTimeout(function() {
      close();
    }, n);
  }

  function buildModal() {
    modal = document.createElement("aside");
    modal.className = "modal " + config.class;
    modal.setAttribute("data-notification", config.type);
    modal.setAttribute("data-theme", config.theme);
    modal.setAttribute("aria-role", "dialog");
    modal.setAttribute("aria-labelledby", "dialog--action");
    modal.appendChild(config.textEl);

    config.textEl.setAttribute("id", config.textId);
    config.textEl.setAttribute("class", config.textClass);
    config.textEl.innerHTML = config.text;

    if (config.button) {
      button = document.createElement("button");
      button.className = "modal--close";
      button.setAttribute("aria-label", "close dialog / press Escape key");
      button.setAttribute("tabindex", "0");
      button.innerHTML = `<svg class="lnr lnr-modal-close lnr-cross"><use xlink:href="#lnr-cross"></use>`;
      modal.appendChild(button);
    }

    overlay.className = config.overlay ? "overlay" : "overlay transparent";

    fragment.appendChild(modal);
    fragment.appendChild(overlay);
    document.body.appendChild(fragment);
  }
  const model = {};
  model.attachEvents = function() {
    if (config.button) {
      button.addEventListener("click", close);
      document.body.addEventListener("keyup", removeModalDialog);
    }
    overlay.addEventListener("click", close);
  };
  model.init = function(options) {
    config = Object.assign({}, defaults, options);
    buildModal();
    this.attachEvents();
    showModal();

    if (config.autoClose) {
      autoClose(config.autoCloseDelay);
    }
  };
  return model;
})();

// Modal.init({
//     class: 'modal--notify',
//     type: 'modal--success',
//     text: `Wablers Sparrows are great birds!`
// });
// Modal.init({
//     class: 'modal--notify',
//     type: 'modal--warning',
//     text: `Wablers Sparrows are great birds!`
// });
// Modal.init({
//     class: 'modal--notify',
//     type: 'modal--error',
//     text: `Wablers Sparrows are great birds!`
// });
