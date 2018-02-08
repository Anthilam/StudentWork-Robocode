class Robot {
  constructor() {
    this.top = 0;
    this.left = 0;
    this.html;
  }

  setPos(offsetTop, offsetLeft) {
    this.top = offsetTop;
    this.left = offsetLeft;
    this.html.style.top = offsetTop + "px";
    this.html.style.left = offsetLeft + "px";
  }
}

class Flag {
  constructor() {
    this.top = 0;
    this.left = 0;
    this.html;
  }

  setPos(offsetTop, offsetLeft) {
    this.top = offsetTop;
    this.left = offsetLeft;
    this.html.style.top = offsetTop + "px";
    this.html.style.left = offsetLeft + "px";
  }
}

var blueRobot = new Robot();
var redRobot = new Robot();

var tabFlag = [];

function init() {
  var board = document.getElementById("board");
  var board_container = document.getElementById("board_container");

  // Génération du tableau
  for (var i = 0; i < 9; ++i) {
    var row = document.createElement("tr");
    board.appendChild(row);
    for (var j = 0; j < 9; ++j) {
      var cell = document.createElement("td");
      row.appendChild(cell);
    }
  }

  // Génération des robots
  blueRobot.html = document.createElement("div");
  var att = document.createAttribute("id");
  att.value = "blueRobot";
  blueRobot.html.setAttributeNode(att);
  board_container.appendChild(blueRobot.html);

  var cell = board.rows[4].cells[8];
  blueRobot.setPos(cell.offsetTop, cell.offsetLeft);

  redRobot.html = document.createElement("div");
  att = document.createAttribute("id");
  att.value = "redRobot";
  redRobot.html.setAttributeNode(att);
  board_container.appendChild(redRobot.html);

  cell = board.rows[4].cells[0];
  redRobot.setPos(cell.offsetTop, cell.offsetLeft);

  // Génération des drapeaux
  for (var i = 0; i < 8; ++i) {
    tabFlag[i] = new Flag();
    tabFlag[i].html = document.createElement("div");
    att = document.createAttribute("class");
    if (i == 0 || i == 2 || i == 4 || i == 6) {
      if (i == 0 || i == 2) {
        cell = board.rows[0].cells[3+i];
      }
      if (i == 4) {
        cell = board.rows[7].cells[4];
      }
      if (i == 6) {
        cell = board.rows[8].cells[4];
      }
      att.value = "redFlag";
    }
    else {
      if (i == 1) {
        cell = board.rows[0].cells[4];
      }
      if (i == 3) {
        cell = board.rows[1].cells[4];
      }
      if (i == 5 || i == 7) {
        cell = board.rows[8].cells[i-2];
      }
      att.value = "blueFlag";
    }

    tabFlag[i].html.setAttributeNode(att);
    board_container.appendChild(tabFlag[i].html);
    tabFlag[i].setPos(cell.offsetTop, cell.offsetLeft);
  }
}

function main() {
  console.log("MAIN");
}

document.addEventListener("DOMContentLoaded", function(e) {
  init();
  main();
});
