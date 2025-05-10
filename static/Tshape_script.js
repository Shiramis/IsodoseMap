function drawTShape(centerX, centerY) {
  const svg = document.getElementById("tShape");
  const ns = "http://www.w3.org/2000/svg";

  // Clear previous content
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const tGroup = document.createElementNS(ns, "g");
  tGroup.setAttribute("id", "tGroup");
  tGroup.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(0)`);

  // Horizontal bar
  const horRect = document.createElementNS(ns, "rect");
  horRect.setAttribute("x", -52.5);    // center horizontally
  horRect.setAttribute("y", -15);    // move above vertical bar
  horRect.setAttribute("width", 100);
  horRect.setAttribute("height", 30);
  horRect.setAttribute("fill", "#8F9A8F");
  horRect.setAttribute("fill-opacity", "0.5");

  // Vertical bar (centered at (0,0), pointing down)
  const vertRect = document.createElementNS(ns, "rect");
  vertRect.setAttribute("x", -17.5); // center horizontally
  vertRect.setAttribute("y", -15);     // start from center downward
  vertRect.setAttribute("width", 30);
  vertRect.setAttribute("height", 120);
  vertRect.setAttribute("fill", "#8F9A8F");
  vertRect.setAttribute("fill-opacity", "0.5");

  // Label: Anode (left)
  const anodeText = document.createElementNS(ns, "text");
  anodeText.setAttribute("x", -70);
  anodeText.setAttribute("y", -25);
  anodeText.setAttribute("fill", "red");
  anodeText.setAttribute("font-size", "12");
  anodeText.textContent = "Anode";

  // Label: Cathode (right)
  const cathodeText = document.createElementNS(ns, "text");
  cathodeText.setAttribute("x", 35);
  cathodeText.setAttribute("y", -25);
  cathodeText.setAttribute("fill", "blue");
  cathodeText.setAttribute("font-size", "12");
  cathodeText.textContent = "Cathode";

  tGroup.appendChild(horRect);
  tGroup.appendChild(vertRect);
  tGroup.appendChild(anodeText);
  tGroup.appendChild(cathodeText);
  svg.appendChild(tGroup);

  // Rotation handler
  const slider = document.getElementById("rotateSlider");
  slider.addEventListener("input", function () {
    const angle = this.value;
    tGroup.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(${angle})`);
  });
}
