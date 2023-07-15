function disableWindowEvents() {
  window.onclick = (e) => {
    aside.classList.remove("aside-show");
  };
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

function readSketchFile(e) {
  const reader = new FileReader();
  reader.onload = function () {
    let colorList = JSON.parse(reader.result);
    removePixels();
    dimentionSize = Math.sqrt(colorList.length);
    dimentionRange.value = dimentionSize;
    updateDimentionLabel();
    calcPixelSize();
    createPixels();
    for (let i = 0; i < pixels.length; i++) {
      draw(pixels[i], colorList[i]);
    }
  };
  reader.readAsText(this.files[0]);
}

function makeSketchFile(e) {
  let colorsList = [];
  pixels.forEach((pixel) => {
    colorsList.push(rgbToHex(pixel.style.backgroundColor));
  });

  let file = new Blob([`${JSON.stringify(colorsList)}`], {
    type: "text/plain",
  });

  let link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "sketch.json";
  let event = new MouseEvent("click");
  link.dispatchEvent(event);
}

function setCircleColors() {
  colorCircles[0].style.backgroundColor = brushColorOne;
  colorCircles[1].style.backgroundColor = brushColorTwo;
  colorCircles[2].style.backgroundColor = eraserColor;
}

function setBrushColors() {
  brushColorPickerOne.value = brushColorOne;
  brushColorPickerTwo.value = brushColorTwo;
  eraserColorPicker.value = eraserColor;
  setCircleColors();
}

function swapColors(e) {
  let tmpColor = brushColorOne;
  brushColorOne = brushColorTwo;
  brushColorTwo = tmpColor;
  setBrushColors();
  setCircleColors();
}

function resetColors(e) {
  brushColorOne = "#000000";
  brushColorTwo = "#ff0000";
  eraserColor = "#ffffff";
  setBrushColors();
}

function darkenRGB(rgb) {
  let colors = rgbtoRgbList(rgb);
  if (Math.max(colors[0], colors[1], colors[2]) >= 2) {
    // we dont want to go out of proportions between colors
    // and since round(2 * 0.98) = 1  then 2 is a safe point
    for (let i = 0; i < 3; i++) {
      colors[i] = Math.max(0, Math.floor(colors[i] * 0.98));
    }
  }
  return rgbToHex(colors);
}

function brightenRGB(rgb) {
  let colors = rgbtoRgbList(rgb);
  if (Math.max(colors[0], colors[1], colors[2]) === 0) {
    // if the color is rgb(0, 0, 0) (black) we can not increase values
    // with the upcoming calculation since 0 * number = 0
    for (let i = 0; i < 3; i++) {
      colors[i] = 50;
    }
  }

  if (Math.max(colors[0], colors[1], colors[2]) <= 248) {
    // we dont want to go out of proportions between colors
    // and since 250 * 1.02 = 255 then 248 is a safe point
    for (let i = 0; i < 3; i++) {
      colors[i] = Math.min(255, Math.ceil(colors[i] * 1.02));
    }
  }
  return rgbToHex(colors);
}

function rgbtoRgbList(rgb) {
  rgb = rgb.slice(4, rgb.length - 1).split(",");
  for (let i = 0; i < 3; i++) {
    rgb[i] = Number.parseInt(rgb[i]);
  }
  return rgb;
}

function rgbToHex(rgb) {
  let colors;
  if (Array.isArray(rgb)) {
    colors = rgb;
  } else {
    colors = rgbtoRgbList(rgb);
  }
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

function genRandomRgb() {
  rgbList = [];
  for (let i = 0; i <= 3; i++) {
    rgbList.push(Math.round(Math.random() * 255));
  }
  return rgbToHex(rgbList);
}

function colorPixels(e) {
  // console.log(e);
  let color = brushColorOne;
  e.stopPropagation();
  if (e.buttons === 1) {
    if (e.ctrlKey) {
      draw(this, eraserColor);
    } else if (e.shiftKey) {
      draw(this, brushColorTwo);
    } else {
      draw(this, brushColorOne);
    }
  } else if (e.buttons === 4) {
    if (e.ctrlKey) {
      color = brightenRGB(this.style.backgroundColor);
      console.log(color);
    } else if (e.shiftKey) {
      color = genRandomRgb();
      console.log(color);
    } else {
      color = darkenRGB(this.style.backgroundColor);
      console.log(color);
    }
    draw(this, color);
  } else if (e.type === "wheel") {
    color;
    if (e.wheelDelta > 0) {
      color = brightenRGB(this.style.backgroundColor);
    } else {
      color = darkenRGB(this.style.backgroundColor);
    }
    draw(this, color);
  }
}

function toggleGrid() {
  pixels.forEach((pixel) => {
    pixel.classList.toggle("pixel-border");
  });
}

function initializePixel(pixel, i, color) {
  pixel.setAttribute("id", `pix_${i}`);
  pixel.classList.add("pixel");
  pixel.addEventListener("mouseenter", colorPixels);
  // pixel.addEventListener("mousemove", colorPixels); // mousemove creates thoousands of events per pixel
  pixel.addEventListener("mousedown", colorPixels);
  pixel.addEventListener("wheel", colorPixels, { passive: true });
  draw(pixel, color);
  pixel.style.minWidth = toPixels(pixelSize);
  pixel.style.minHeight = toPixels(pixelSize);
}

function createPixels() {
  // craete dimentionSize x dimentionSize divs and put inside pixels array
  let row;
  let pixel;
  for (let i = 0; i < dimentionSize; i++) {
    row = document.createElement("div");
    for (let j = 1; j <= dimentionSize; j++) {
      row.classList.add("row");
      pixel = document.createElement("div");
      initializePixel(pixel, dimentionSize * i + j, eraserColor);
      row.appendChild(pixel);
      pixels.push(pixel);
    }
    sketchPixels.appendChild(row);
    rows.push(row);
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

function calcPixelSize() {
  pixelSize = Math.floor(sketchPixels.clientHeight / dimentionSize);
}

const sketchPixels = document.querySelector(".sketch-pixels");
const brushColorPickerOne = document.querySelector("#brush-color-picker-one");
const brushColorPickerTwo = document.querySelector("#brush-color-picker-two");
const eraserColorPicker = document.querySelector("#eraser-color-picker");
const colorCircles = document.querySelectorAll(".color-circle");
const dimentionRange = document.querySelector("#dimention-range");
const dimentionLabel = document.querySelector(".dimention-container > label");
const contextMenu = document.querySelector(".context-menu");
const importSketch = document.querySelector(".import-sketch");
const aside = document.querySelector(".aside");

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
  // pixelSize =
  calcPixelSize();

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

  document
    .querySelector(".save-sketch")
    .addEventListener("click", makeSketchFile);

  document
    .querySelector(".import-sketch-btn")
    .addEventListener("click", (e) => {
      importSketch.click();
    });

  document.querySelector(".show-help-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    aside.classList.toggle("aside-show");
  });

  importSketch.addEventListener("change", readSketchFile);

  aside.addEventListener("mouseleave", (e) => {
    aside.classList.remove("aside-show");
  });

  brushColorPickerOne.addEventListener("input", (e) => {
    brushColorOne = brushColorPickerOne.value;
    // colorCircles[0].style.backgroundColor = brushColorOne;
    setBrushColors();
  });

  brushColorPickerTwo.addEventListener("input", (e) => {
    brushColorTwo = brushColorPickerTwo.value;
    // colorCircles[1].style.backgroundColor = brushColorTwo;
    setBrushColors();
  });

  eraserColorPicker.addEventListener("input", (e) => {
    eraserColor = eraserColorPicker.value;
    // colorCircles[2].style.backgroundColor = eraserColor;
    setBrushColors();
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
      setBrushColors();
      e.stopPropagation();
    });

  document
    .querySelector(".pick-for-brush-two")
    .addEventListener("mousedown", (e) => {
      brushColorTwo = rgbToHex(contextPixel.style.backgroundColor);
      setBrushColors();
      e.stopPropagation();
    });

  document
    .querySelector(".pick-for-eraser")
    .addEventListener("mousedown", (e) => {
      eraserColor = rgbToHex(contextPixel.style.backgroundColor);
      setBrushColors();
      e.stopPropagation();
    });

  createPixels();
}

init();
