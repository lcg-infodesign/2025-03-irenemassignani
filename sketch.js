// Margine esterno per non disegnare sui bordi del canvas
let outerMargin = 100;

// Variabile che conterrà i dati caricati dal CSV
let data;

// Variabili globali per i limiti delle scale
let minLon, maxLon, minLat, maxLat, maxValue, minBlur, maxBlur;

function preload() {
  // Carico il file CSV nella cartella "assets"
  // Il terzo parametro ("header") indica che la prima riga del file contiene i nomi delle colonne
  data = loadTable("assets/data.csv", "csv", "header");
}

function setup() {
  // Crea un canvas che riempie tutta la finestra del browser
  let c = createCanvas(windowWidth, windowHeight);
  c.parent("main");
  // --- DEFINIZIONE DELLE SCALE ---
  // Scala per la longitudine → asse X
  let allLon = data.getColumn("Longitude");
  minLon = min(allLon);
  maxLon = max(allLon);

  // Scala per la latitudine → asse Y
  let allLat = data.getColumn("Latitude");
  minLat = min(allLat);
  maxLat = max(allLat);

}

function draw() {
  background(10, 120, 255);
  drawStatsBox();
  drawGriglia();

  // Variabile per memorizzare il punto su cui il mouse passa sopra
  let hovered = null;

  // --- CICLO PRINCIPALE: disegna un cerchio per ogni riga del dataset ---
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    // Leggo i dati dalle colonne del CSV
    let country = data.getString(rowNumber, "Country");
    let lat = data.getNum(rowNumber, "Latitude");
    let lon = data.getNum(rowNumber, "Longitude");
    let location = data.getString(rowNumber, "Location");
    let name = data.getString(rowNumber, "Volcano Name");
    let type = data.getString(rowNumber, "Type");
    let typec = data.getString(rowNumber, "TypeCategory");
    let elev = data.getString(rowNumber, "Elevation (m)");
    let status = data.getString(rowNumber, "Status");
    let last = data.getString(rowNumber, "Last Known Eruption");

    // Converto le coordinate geografiche in coordinate del canvas
    let x = map(lon, minLon, maxLon, outerMargin, width - outerMargin);
    let y = map(lat, minLat, maxLat, height - outerMargin, outerMargin);

    // Raggio proporzionale al valore
    let radius = 15;
    
    // Calcolo la distanza dal mouse
    let d = dist(mouseX, mouseY, x, y);

    // Se il mouse è sopra il cerchio → cambia colore e salva i dati per il tooltip
    if (d < radius / 2) {
      hovered = { x, y, country, location, name, type, typec, elev, status, last};
      drawSun(x, y, radius, "yellow");
    } else {
      drawSun(x, y, radius, "green");
    }
  }

  // --- TOOLTIP ---
  // metto il tooltip alla fine per essere sicuro che sia disegnato sopra a tutto
  if (hovered) {
    // Cambia il cursore in “mano” (interattivo)
    cursor("pointer");
    // Testo del tooltip: mostra paese e valore
    let tooltipText = 
    `
    ${hovered.country} 
    ${hovered.location}
    ${hovered.name}
    ${hovered.type}
    ${hovered.typec}
    ${hovered.elev}
    ${hovered.status}
    ${hovered.last}
    `;
    drawTooltip(hovered.x, hovered.y, tooltipText);
  } else {
    // Torna al cursore normale
    cursor("default");
  }
}

function drawSun(x, y, radius, color) {
  fill(color);
  ellipse(x, y, radius, radius);
  
  noFill();
  stroke(0);
  strokeWeight(1);
  ellipse(x, y, radius, radius);
}

function drawStatsBox(){
  noStroke();
  let x=0,y=0;
  let w = 500;
  let h = 55;
  fill(0, 80, 190);
  noStroke();
  rect(x + 100, y +40, w, h, 10);
  fill(255);textSize(35); textAlign(LEFT,TOP); textStyle (BOLD);
  text("Mappa dei vulcani nel mondo",x+105,y+50);
}

function drawTooltip(px, py, data) {
  let w = 200;
  let h = 170;

  if (py + 15 + h > height) {
    py = height - h - 15;
  }

   if (px + 15 + w > width) {
    px = width - w - 15;
  }

  fill(0, 80, 190, 200);
  noStroke();
  rect(px + 15, py + 15, w, h, 10);

  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(data, px + 20, py + 18);
}

function drawGriglia() {
  stroke(255, 100);       
  strokeWeight(1);

  let stepLon = 15;
  let stepLat = 10; 

  for (let lon = -180; lon <= 180; lon += stepLon) {
    let x = map(lon, -180, 180, outerMargin, width - outerMargin);
    line(x, outerMargin, x, height - outerMargin);
  }

  for (let lat = -90; lat <= 90; lat += stepLat) {
    let y = map(lat, -90, 90, height - outerMargin, outerMargin);
    line(outerMargin, y, width - outerMargin, y);
  }
}