export function drawTShape(centerX, centerY) {
  const svg = document.getElementById("tShape");
  const ns = "http://www.w3.org/2000/svg";

  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const tGroup = document.createElementNS(ns, "g");
  tGroup.setAttribute("id", "tGroup");
  tGroup.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(0)`);

  const horRect = document.createElementNS(ns, "rect");
  horRect.setAttribute("x", -50);
  horRect.setAttribute("y", -15);
  horRect.setAttribute("width", 100);
  horRect.setAttribute("height", 30);
  horRect.setAttribute("fill", "none");
  horRect.setAttribute("stroke", "black");
  horRect.setAttribute("stroke-width", "1.5");
  horRect.setAttribute("stroke-opacity", "0.5");

  const vertRect = document.createElementNS(ns, "rect");
  vertRect.setAttribute("x", -15);
  vertRect.setAttribute("y", -15);
  vertRect.setAttribute("width", 30);
  vertRect.setAttribute("height", 120);
  vertRect.setAttribute("fill", "none");
  vertRect.setAttribute("stroke", "black");
  vertRect.setAttribute("stroke-width", "1.5");
  vertRect.setAttribute("stroke-opacity", "0.5");

  const anodeText = document.createElementNS(ns, "text");
  anodeText.setAttribute("x", -70);
  anodeText.setAttribute("y", -25);
  anodeText.setAttribute("fill", "red");
  anodeText.setAttribute("font-size", "12");
  anodeText.textContent = "Anode";

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

  const slider = document.getElementById("rotateSlider");
  slider.addEventListener("input", function () {
    const angle = this.value;
    tGroup.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(${angle}, 0, 0)`);
  });
}