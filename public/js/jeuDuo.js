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

  useCards() {
    // Do something with tabCard
    console.log(this.tabCard);
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

// A class representing a Card
class Card {
  constructor(color, name, act) {
    this.isUsed = false;
    this.action = act;
    this.html = "../images/"+name+"-"+color+".png";
  }

  reaction(tabCard, i) {
    tabCard[i] = this.action;
  }
}

// Global vars
var blueRobot = new Robot();
var redRobot = new Robot();
// A table containing the flags
var tabFlag = [];
// A boolean table representing which cell of the board is occupied or not
var tabBoard = [[],[],[],[],[],[],[],[],[]];

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

function show_deck(string){
  document.getElementById("deck").style.display = "block";

  var html = "";

  if (string == "red") {
    html += '<img src="../images/annuler-rouge.png" width="45%"">';
    html += '<img src="../images/deposer-rouge.png">';
    html += '<img src="../images/est-rouge.png">';
    html += '<img src="../images/est-x2-rouge.png">';
    html += '<img src="../images/nord-rouge.png">';
    html += '<img src="../images/ouest-rouge.png">';
    html += '<img src="../images/pause-rouge.png">';
    html += '<img src="../images/prendre-rouge.png">';
    html += '<img src="../images/repousser-rouge.png">';
    html += '<img src="../images/sud-rouge.png">';
    html += '<img src="../images/x2-rouge.png">';
  }

  document.getElementById("img_deck").innerHTML = html;
}

function main() {
  console.log("--MAIN--");

  var blue_north = new Card("bleu", "nord", "N");
  var blue_east = new Card("bleu", "est", "E");
  var blue_south = new Card("bleu", "sud", "S");
  var blue_west = new Card("bleu", "ouest", "W");
  var blue_west_x2 = new Card("bleu", "ouest-x2", "WX2");
  var blue_take = new Card("bleu", "prendre", "TAKE");
  var blue_put = new Card("bleu", "deposer", "PUT");
  var blue_repulse = new Card("bleu", "repousser", "REP");
  var blue_undo = new Card("bleu", "annuler", "UNDO");
  var blue_x2 = new Card("bleu", "x2", "X2");
  var blue_pause = new Card("bleu", "pause", "STOP");

  var red_north = new Card("rouge", "nord", "N");
  var red_east = new Card("rouge", "est", "E");
  var red_south = new Card("rouge", "sud", "S");
  var red_west = new Card("rouge", "ouest", "W");
  var red_east_x2 = new Card("rouge", "est-x2", "EX2");
  var red_take = new Card("rouge", "prendre", "TAKE");
  var red_put = new Card("rouge", "deposer", "PUT");
  var red_repulse = new Card("rouge", "repousser", "REP");
  var red_undo = new Card("rouge", "annuler", "UNDO");
  var red_x2 = new Card("rouge", "x2", "X2");
  var red_pause = new Card("rouge", "pause", "STOP");

  blue_north.reaction(blueRobot.tabCard, 0);

  red_pause.reaction(redRobot.tabCard, 0);

  console.log(blueRobot.tabCard);
  console.log(redRobot.tabCard);
}

window.addEventListener("resize", refreshPos);

document.addEventListener("DOMContentLoaded", function(e) {
  init();
  main();
});
