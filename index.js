function disableWindowEvents() {
  window.ondragstart = (e) => {
    return false;
  };
  window.oncontextmenu = (e) => {
    return false;
  };

  window.onselectstart = (e) => {
    return false;
  };

  window.onkeydown = (e) => {
    if (e.ctrlKey && e.code === "KeyA") return false;
  };
}

function setColors() {
  brushColorPickerOne.value = brushColorOne;
  brushColorPickerTwo.value = brushColorTwo;
  eraserColorPicker.value = eraserColor;
}

function swapColors(e) {
  let tmpColor = brushColorOne;
  brushColorOne = brushColorTwo;
  brushColorTwo = tmpColor;
  setColors();
}

function resetColors(e) {
  brushColorOne = "#000000";
  brushColorTwo = "#ff0000";
  eraserColor = "#ffffff";
  setColors();
}

function rgbToHex(rgb) {
  let colors = rgb.slice(4, rgb.length - 1).split(",");
  let hex = "#";
  for (let i = 0; i < 3; i++) {
    colors[i] = parseInt(colors[i]).toString(16).padStart(2, "0");
    hex += colors[i];
  }
  return hex;
}

function showContextMenu(e) {
  contextPixel = e.srcElement;
  contextMenu.classList.add("visible");
  contextMenu.style.top = `${e.y - 10}px`;
  contextMenu.style.left = `${e.x - 10}px`;
}

function hideContextMenu(e) {
  e.stopPropagation();
  contextMenu.classList.remove("visible");
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
    if (e.ctrlKey) {
      draw(this, eraserColor);
    } else if (e.shiftKey) {
      draw(this, brushColorTwo);
    } else {
      draw(this, brushColorOne);
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
  draw(pixel, eraserColor);
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

const sketchPixels = document.querySelector(".sketch-pixels");
const brushColorPickerOne = document.querySelector("#brush-color-picker-one");
const brushColorPickerTwo = document.querySelector("#brush-color-picker-two");
const eraserColorPicker = document.querySelector("#eraser-color-picker");
const dimentionRange = document.querySelector("#dimention-range");
const dimentionLabel = document.querySelector(".dimention-container > label");
const contextMenu = document.querySelector(".context-menu");

let pixels = [];
let rows = [];
let brushColorOne;
let brushColorTwo;
let eraserColor;
let dimentionSize;
let pixelSize;
let contextPixel;

function init() {
  disableWindowEvents();
  brushColorOne = brushColorPickerOne.value;
  brushColorTwo = brushColorPickerTwo.value;
  eraserColor = eraserColorPicker.value;
  dimentionSize = parseInt(dimentionRange.value);
  pixelSize = Math.floor(sketchPixels.clientHeight / dimentionSize);

  document.querySelector(".toggle-grid").addEventListener("click", (e) => {
    toggleGrid();
  });

  document.querySelector(".clear-sketch").addEventListener("click", (e) => {
    removePixels();
    createPixels();
  });

  document
    .querySelector(".reset-colors")
    .addEventListener("click", resetColors);

  document.querySelector(".swap-colors").addEventListener("click", swapColors);

  brushColorPickerOne.addEventListener("input", (e) => {
    brushColorOne = brushColorPickerOne.value;
  });

  brushColorPickerTwo.addEventListener("input", (e) => {
    brushColorTwo = brushColorPickerTwo.value;
  });

  eraserColorPicker.addEventListener("input", (e) => {
    eraserColor = eraserColorPicker.value;
  });

  dimentionRange.addEventListener("input", (e) => {
    dimentionSize = parseInt(dimentionRange.value);
    pixelSize = Math.floor(480 / dimentionSize);
    updateDimentionLabel();
    removePixels();
    createPixels();
  });

  sketchPixels.addEventListener("contextmenu", showContextMenu);
  contextMenu.addEventListener("mouseleave", hideContextMenu);
  contextMenu.addEventListener("mouseup", hideContextMenu);

  document
    .querySelector(".pick-for-brush-one")
    .addEventListener("mousedown", (e) => {
      brushColorOne = rgbToHex(contextPixel.style.backgroundColor);
      setColors();
      e.stopPropagation();
    });

  document
    .querySelector(".pick-for-brush-two")
    .addEventListener("mousedown", (e) => {
      brushColorTwo = rgbToHex(contextPixel.style.backgroundColor);
      setColors();
      e.stopPropagation();
    });

  document
    .querySelector(".pick-for-eraser")
    .addEventListener("mousedown", (e) => {
      eraserColor = rgbToHex(contextPixel.style.backgroundColor);
      setColors();
      e.stopPropagation();
    });

  createPixels();
}

init();
