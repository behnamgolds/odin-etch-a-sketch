function disableWindowEvents() {
  window.ondragstart = (e) => {
    return false;
  };
  window.oncontextmenu = (e) => {
    return false;
  };
}

function updateDimentionLabel() {
  const dsize = dimentionRange.value;
  dimentionLabel.innerText = `Sketch Size: ${dsize}x${dsize}`;
}

function toPixels(size) {
  return `${size}px`;
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

function toggleGrid() {
  pixels.forEach((pixel) => {
    pixel.classList.toggle("pixel-border");
  });
}

function initializePixel(pixel, i) {
  pixel.setAttribute("id", `pix_${i}`);
  pixel.classList.add("pixel");
  pixel.addEventListener("mouseenter", colorPixels);
  pixel.addEventListener("mousemove", colorPixels);
  pixel.addEventListener("mousedown", colorPixels);
  draw(pixel, backColor);
  pixel.style.minWidth = toPixels(pixelSize);
  pixel.style.minHeight = toPixels(pixelSize);
}

function createPixels() {
  // craete count x count divs and put inside pixels
  let rowNum = 0;
  let row;
  let pixel;
  for (let i = 1; i <= dimentionSize; i++) {
    row = document.createElement("div");
    for (let j = 1; j <= dimentionSize; j++) {
      row.classList.add("row");
      pixel = document.createElement("div");
      initializePixel(pixel, rowNum * i + j);
      row.appendChild(pixel);
      pixels.push(pixel);
    }
    sketchPixels.appendChild(row);
    rows.push(row);
    rowNum++;
  }
  toggleGrid();
}

function removePixels() {
  pixels.forEach((pixel) => {
    pixel.remove();
  });

  rows.forEach((row) => {
    row.remove();
  });
  pixels = [];
  rows = [];
}

disableWindowEvents();
const sketchPixels = document.querySelector(".sketch-pixels");
const brushColorPicker = document.querySelector("#brush-color-picker");
const backColorPicker = document.querySelector("#back-color-picker");
const dimentionRange = document.querySelector("#dimention-range");
const dimentionLabel = document.querySelector(".dimention-container > label");

let pixels = [];
let rows = [];
let brushColor;
let backColor;
let dimentionSize;
let pixelSize;

function init() {
  brushColor = brushColorPicker.value;
  backColor = backColorPicker.value;
  dimentionSize = parseInt(dimentionRange.value);
  pixelSize = Math.floor(sketchPixels.clientHeight / dimentionSize);

  document.querySelector(".toggle-grid").addEventListener("click", (e) => {
    toggleGrid();
  });

  brushColorPicker.addEventListener("input", (e) => {
    brushColor = brushColorPicker.value;
  });

  backColorPicker.addEventListener("input", (e) => {
    backColor = backColorPicker.value;
  });

  dimentionRange.addEventListener("input", (e) => {
    dimentionSize = parseInt(dimentionRange.value);
    pixelSize = Math.floor(480 / dimentionSize);
    updateDimentionLabel();
    removePixels();
    createPixels();
  });

  createPixels();
}

init();
