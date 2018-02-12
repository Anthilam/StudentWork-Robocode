// A class representing a robot
class Robot {
  constructor() {
    this.row = 0;
    this.cell = 0;
    this.html = "";
    this.tabCard = [];
  }

  setPos(offsetTop, offsetLeft) {
    this.html.style.top = offsetTop + "px";
    this.html.style.left = offsetLeft + "px";
  }
}

// A class representing a flag
class Flag {
  constructor() {
    this.row = 0;
    this.cell = 0;
    this.html;
  }

  setPos(offsetTop, offsetLeft) {
    this.html.style.top = offsetTop + "px";
    this.html.style.left = offsetLeft + "px";
  }
}

// A class representing a red_card
class Card {
  constructor(html) {
    this.isUsed = false;
    this.html = html;
  }

  action(tabCard, i) {
    console.log("Card");
  }
}

class dirCard extends Card {
  constructor(dir, color) {
    switch (dir) {
      case 0: super("../images/nord-"+color+".png"); break;
      case 1: super("../images/est-"+color+".png"); break;
      case 2: super("../images/sud-"+color+".png"); break;
      case 3: super("../images/ouest-"+color+".png"); break;
      default: super("../images/nord-"+color+".png");
    }
    this.dir = dir;
  }

  action(tabCard, i) {
    switch (this.dir) {
      case 0: tabCard[i] = "N"; break;
      case 1: tabCard[i] = "E"; break;
      case 2: tabCard[i] = "S"; break;
      case 3: tabCard[i] = "W"; break;
      default: tabCard[i] = "N";
    }
  }
}

class dirX2Card extends Card {
  constructor(color) {
    if (color == "bleu") {
      super("../images/ouest-x2-bleu.png");
      this.dir = 3;
    }
    else {
      super("../images/est-x2-rouge.png");
      this.dir = 1;
    }
  }

  action(tabCard, i) {
    if (this.dir == 1) {
      tabCard[i] = "EX2";
    }
    else {
      tabCard[i] = "WX2";
    }
  }
}

class takeCard extends Card {
  constructor(color) {
    super("../images/prendre-"+color+".png");
  }

  action(tabCard, i) {
    tabCard[i] = "TAKE";
  }
}

class putCard extends Card {
  constructor(color) {
    super("../images/deposer-"+color+".png");
  }

  action(tabCard, i) {
    tabCard[i] = "PUT";
  }
}

class repulseCard extends Card {
  constructor(color) {
    super("../images/repousser-"+color+".png");
  }

  action(tabCard, i) {
    tabCard[i] = "REPULSE";
  }
}

class undoCard extends Card {
  constructor(color) {
    super("../images/annuler-"+color+".png");
  }

  action(tabCard, i) {
    tabCard[i] = "UNDO";
  }
}

// Global vars
var blueRobot = new Robot();
var redRobot = new Robot();
// A table containing the flags
var tabFlag = [];
// A boolean table representing which cell of the board is occupied or not
var tabBoard = [[],[],[],[],[],[],[],[],[]];
// A table containing the actions of the cards
var tabCard = [];

/* refreshPos():
 *  Refreshes all the elements position
 */
function refreshPos() {
  console.log("Call: refreshPos()");

  var board = document.getElementById("board");
  // Refresh of the redRobot
  var cell = board.rows[redRobot.row].cells[redRobot.cell];
  redRobot.setPos(cell.offsetTop, cell.offsetLeft);
  // Refresh of the blueRobot
  cell = board.rows[blueRobot.row].cells[blueRobot.cell];
  blueRobot.setPos(cell.offsetTop, cell.offsetLeft);
  // Refresh of the flags
  for (var i in tabFlag) {
    cell = board.rows[tabFlag[i].row].cells[tabFlag[i].cell];
    tabFlag[i].setPos(cell.offsetTop, cell.offsetLeft);
  }
}

/* randInt(max):
 *  Randomizes a number between 0 and max-1
 */
function randInt(max) {
  console.log("Call: randInt("+max+")");

  return Math.floor(Math.random() * max);
}

/* superSwitch(elem, rand, row, cell, other, onside) :
 *  Makes a special switch with the parameters given
 */
function superSwitch(elem, rand, row, cell, other, onside) {
  console.log("Call: superSwitch("+elem+","+rand+","+row+","+cell+","+other+","+onside+")");

  if (onside) {
    switch (rand) {
      case 0: elem.row = row; elem.cell = cell; break;
      case 1: elem.row = row+1; elem.cell = cell; break;
      case 2: elem.row = row+2; elem.cell = cell; break;
      case 3: elem.row = row+1; elem.cell = other; break;
      default: elem.row = row+1; elem.cell = cell;
    }
  }
  else {
    switch (rand) {
      case 0: elem.row = row; elem.cell = cell; break;
      case 1: elem.row = row; elem.cell = cell+1; break;
      case 2: elem.row = row; elem.cell = cell+2; break;
      case 3: elem.row = other; elem.cell = cell+1; break;
      default: elem.row = row; elem.cell = cell+1;
    }
  }
}

/* init():
 *  Initializes the game
 */
function init() {
  console.log("--INIT--");

  var board = document.getElementById("board");
  var board_container = document.getElementById("board_container");
  var r = 0; // Random number

  // Board generation
  for (var i = 0; i < 9; ++i) {
    var row = document.createElement("tr");
    board.appendChild(row);
    for (var j = 0; j < 9; ++j) {
      var cell = document.createElement("td");
      // Blue and Red bases generation
      if (i == 3 || i == 4 || i == 5) {
        if (j == 0 || (j == 1 && i == 4)) {
          cell.setAttribute("class", "redBase");
        }
        else if (j == 8 || (j == 7 && i == 4)) {
          cell.setAttribute("class", "blueBase");
        }
      }
      // Flag bases generation
      else if (j == 3 || j == 4 || j == 5) {
        if (i == 0 || (i == 1 && j == 4) || (i == 7 && j == 4) || i == 8) {
          cell.setAttribute("class", "flagBase");
        }
      }
      row.appendChild(cell);
      // Initialization of the boolean board
      tabBoard[i][j] = false;
    }
  }

  // redRobot generation
  redRobot.html = document.createElement("div");
  redRobot.html.setAttribute("id", "redRobot");
  board_container.appendChild(redRobot.html);
  r = randInt(4);
  superSwitch(redRobot, r, 3, 0, 1, true);

  // blueRobot generation
  blueRobot.html = document.createElement("div");
  blueRobot.html.setAttribute("id", "blueRobot");
  board_container.appendChild(blueRobot.html);
  r = randInt(4);
  superSwitch(blueRobot, r, 3, 8, 7, true);

  // Flags generation
  for (var i = 0; i < 8; ++i) {
    tabFlag[i] = new Flag();
    tabFlag[i].html = document.createElement("div");
    att = document.createAttribute("class");

    // First base
    if (i < 4) {
      // Loop until an empty cell is found
      do {
        r = randInt(4);
        superSwitch(tabFlag[i], r, 0, 3, 1, false);
      } while (tabBoard[tabFlag[i].row][tabFlag[i].cell] == true);

      tabBoard[tabFlag[i].row][tabFlag[i].cell] = true;
      (i < 2) ? att.value = "redFlag" : att.value = "blueFlag";
    }
    // Second base
    else {
      // Loop until an empty cell is found
      do {
        r = randInt(4);
        superSwitch(tabFlag[i], r, 8, 3, 7, false);
      } while (tabBoard[tabFlag[i].row][tabFlag[i].cell] == true);

      tabBoard[tabFlag[i].row][tabFlag[i].cell] = true;
      (i < 6) ? att.value = "redFlag" : att.value = "blueFlag";
    }

    tabFlag[i].html.setAttributeNode(att);
    board_container.appendChild(tabFlag[i].html);
  }

  refreshPos();
}

function main() {
  console.log("--MAIN--");
  var nCard = new dirCard(0, "bleu");
  var eCard = new dirCard(1, "rouge");
  var sCard = new dirCard(2, "bleu");
  var wCard = new dirCard(3, "rouge");
  var bluex2Card = new dirX2Card("bleu");
  var redx2Card = new dirX2Card("rouge");
  var tCard = new takeCard("bleu");
  var pCard = new putCard("bleu");
  var rCard = new repulseCard("rouge");
  var uCard = new undoCard("rouge");


  nCard.action(tabCard, 0);
  eCard.action(tabCard, 1);
  sCard.action(tabCard, 2);
  wCard.action(tabCard, 3);
  bluex2Card.action(tabCard, 4);
  redx2Card.action(tabCard, 5);
  tCard.action(tabCard, 6);
  pCard.action(tabCard, 7);
  rCard.action(tabCard, 8);
  uCard.action(tabCard, 9);

  rCard.action(blueRobot.tabCard, 0);
  uCard.action(redRobot.tabCard, 0);

  console.log(tabCard);
  console.log(blueRobot.tabCard);
  console.log(redRobot.tabCard);
}

window.addEventListener("resize", refreshPos);

document.addEventListener("DOMContentLoaded", function(e) {
  init();
  main();
});
