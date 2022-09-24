const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");
// variables globalees avec la valuer par défaut
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";
const setCanvasBackground = () => {
    // paramètre pour le canvas
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // utilisation de la couleur sélectionnée
}
window.addEventListener("load", () => {
    // largeur et hauteur du canvas 
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
const drawRect = (e) => {
    // si le fillColor n'est pas checké on fait un rectangle en border si il est checké on fait un rectangle avec un background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath(); // création du path pour le cercle
    // on paramètre un radius au cercle en fonction du déplacemeent de la souris
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // on créé le cercle la ou il y'a la souris
    fillColor.checked ? ctx.fill() : ctx.stroke(); // si fillColor est checké on fait avec background sinon avec des border
}
const drawTriangle = (e) => {
    ctx.beginPath(); // création du path pour le triangle
    ctx.moveTo(prevMouseX, prevMouseY); // placer le triangle au niveau du pointer
    ctx.lineTo(e.offsetX, e.offsetY); // on créé la 1ere ligne en fonction de la position de la souris
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // création de la base du triangle
    ctx.closePath(); // on referme le path
    fillColor.checked ? ctx.fill() : ctx.stroke(); // si fillColor est checké on fait avec background sinon avec des border
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // on passe à prevMouseX la la position de mouseX
    prevMouseY = e.offsetY; // on passe à prevMouseY la la position de mouseY
    ctx.beginPath(); // on crée le patch du début de tracer
    ctx.lineWidth = brushWidth; // on passe la largeur de la brosse en largeur de trait
    ctx.strokeStyle = selectedColor; // on passe la couleur sélectionnée
    ctx.fillStyle = selectedColor; // on passe la couleur sélectionnée
    // on copie l'image du canvas dans un snapshot
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // eventListener sur les btn des outils
    // remove de le la classe active sur l'option précedente
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // on passe la valeur de la range à notre brosse
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // eventListener sur les btn des couleurs
        // remove de le la classe active sur l'option précedente
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");

        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});
saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);