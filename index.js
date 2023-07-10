function disableWindowEvents() {
  window.ondragstart = (e) => {
    return false;
  };
  window.oncontextmenu = (e) => {
    return false;
  };
}

function draw(pixel, color) {
  pixel.style.backgroundColor = color;
}

function colorPixels(e) {
  e.stopPropagation();
  if (e.buttons === 1) {
    if (e.ctrlKey === false) {
      draw(this, brushColor);
    } else {
      draw(this, backColor);
    }
  }
}

function initializePixel(pixel, i) {
  pixel.setAttribute("id", i);
  pixel.classList.add("pixel");
  pixel.addEventListener("mouseenter", colorPixels);
  pixel.addEventListener("mousemove", colorPixels);
  pixel.addEventListener("mousedown", colorPixels);
  draw(pixel, backColor);
}

function createPixels(count) {
  // craete count x count divs and put inside pixels
  for (let i = 0; i < count * count; i++) {
    let pixel = document.createElement("div");
    initializePixel(pixel, i);
    pixels.appendChild(pixel);
  }
}

disableWindowEvents();
const pixels = document.querySelector(".sketch-pixels");
const brushColorPicker = document.querySelector("#brush-color-picker");
const backColorPicker = document.querySelector("#back-color-picker");
let brushColor = brushColorPicker.value;
let backColor = backColorPicker.value;
brushColorPicker.addEventListener("input", (e) => {
  brushColor = brushColorPicker.value;
});

backColorPicker.addEventListener("input", (e) => {
  backColor = backColorPicker.value;
});

createPixels(16);
