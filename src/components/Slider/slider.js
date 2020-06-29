import styles from "./slider.css";

export const Slider = (function() {
  const defaults = {
    el: null,
    width: 300,
    height: 250,
    currentImage: 0,
    style: "slider",
    images: [
      '<img src="https://unsplash.it/300/250?image=652" alt=""/>',
      '<img src="https://unsplash.it/300/250?image=650" alt=""/>'
    ]
  };

  const slider = {};
  slider.create = function(o, parent) {
    const options = Object.assign({}, defaults, o);

    var el = null,
      ul = null,
      currentImage = 0,
      list = null;

    var count = document.createElement("span");
    var btnPrevious = document.createElement("button");
    var btnNext = document.createElement("button");
    const frag = document.createDocumentFragment();

    const target = document.getElementById(parent);

    btnNext.setAttribute("aria-lable", "next slide");
    btnPrevious.setAttribute("aria-lable", "previous slide");
    count.className = "count";
    btnPrevious.className = "button-style--slider previous";
    btnPrevious.innerHTML =
      '<svg class="lnr lnr-chevron-left"><use xlink:href="#lnr-chevron-left"></use></svg>';
    btnNext.className = "button-style--slider next";
    btnNext.innerHTML =
      '<svg class="lnr lnr-chevron-right"><use xlink:href="#lnr-chevron-right"></use></svg>';

    const buildGallery = function() {
      ul = document.createElement("ul");

      options.images.map(addImages);
      currentImage = options.currentImage;

      ul.className = "image-style--" + options.style;
      // themes set here
      if (options.style === "fade") {
        ul.setAttribute("style", "height:" + options.height + "px;");
      }

      el = document.createElement("aside");
      el.setAttribute("id", "gallery-" + options.id);
      el.setAttribute("class", "gallery");
      el.setAttribute(
        "style",
        "width:" + options.width + "px;height:" + options.height + "px"
      );

      el.appendChild(ul);
      el.appendChild(btnPrevious);
      el.appendChild(btnNext);
      el.appendChild(count);
      el.querySelector("ul").children[currentImage].className =
        "image-list-item active";
      //frag.appendChild(el);
      //target.appendChild(frag);
      target.insertAdjacentElement("afterbegin", el);

      counter(currentImage + 1);

      events();
    };
    const addImages = function(image) {
      var img;
      list = document.createElement("li");
      list.setAttribute("class", "image-list-item");
      if (!image.match(/(<img\s+src=")/gi)) {
        img = new Image(options.width, options.height);
        img.src = image;
        img.alt = "";
        list.appendChild(img);
      } else {
        img = image;
        list.innerHTML = img;
      }
      ul.appendChild(list);
    };
    const counter = function(n) {
      count.textContent = n;
    };
    const slideGallery = function(n) {
      ul.setAttribute(
        "style",
        "transform:translate3d(-" +
          ul.children[currentImage].offsetLeft +
          "px, 0px, 0px)"
      );
    };
    const getSlide = function(n) {
      ul.children[currentImage].classList.remove("active");
      currentImage = (n + ul.children.length) % ul.children.length;
      ul.children[currentImage].className = "image-list-item active";

      if (options.style !== "fade") slideGallery(currentImage);

      counter(currentImage + 1);
    };

    const events = function() {
      btnNext.addEventListener("click", next);
      btnPrevious.addEventListener("click", previous);
      //document.addEventListener('keydown', this.keyEvents);
    };
    const next = function(event) {
      getSlide(currentImage + 1);
    };
    const previous = function(event) {
      getSlide(currentImage - 1);
    };
    const keyEvents = function(event) {
      var keyCode = event.keyCode || event.which;

      if (keyCode === 37) {
        //prev
        btnPrevious.focus();
        getSlide(currentImage - 1);
      }
      if (keyCode === 39) {
        //next
        btnNext.focus();
        getSlide(currentImage + 1);
      }
    };
    buildGallery();
  };
  return slider;
})();
