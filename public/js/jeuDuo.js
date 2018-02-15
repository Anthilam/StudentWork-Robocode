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

//Globals vars which represent the two decks
var blue_deck = [];
var red_deck = [];

//Var which represent the index of a chosen card in a deck
var deck_ind = -1;

//Var which represent if the player change the red or blue deck
var isRed = true;

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

function show_deck(deck,id){
  deck_ind = id;
  document.getElementById("deck").style.display = "block";
  var html;
  console.log(deck);
  if (deck == 0) {
    isRed = true;
    html = print_deck(red_deck);
    document.getElementById("deck").style.backgroundColor = "#db6641";
    document.getElementById("deck").style.border = "2px solid #a33614";
  }else{
    isRed = false;
    html = print_deck(blue_deck);
    document.getElementById("deck").style.backgroundColor = "#418cdb";
    document.getElementById("deck").style.border = "2px solid #1449a3";
  }
  document.getElementById("img_deck").innerHTML = html;
}


function print_deck(deck){
  var html="";
  for(var i in deck){
    html += '<input type="image" onclick="chose_card(\''+i+'\')" class="show_deck" src="'+deck[i].html+'" alt="'+i+'">';
  }
  return html;
}

function chose_card(ind){
  var id;
  var src;
  var id_text;
  var action;
  if(isRed){
    id = "red_"+deck_ind;
    id_text = "red_text_"+deck_ind;
    src = red_deck[ind].html;
    redRobot[deck_ind] = red_deck[ind].action;
  }else{
    id = "blue_"+deck_ind;
    id_text = "blue_text_"+deck_ind;
    src = blue_deck[ind].html;
    blueRobot[deck_ind] = blue_deck[ind].action;
  }
  document.getElementById(id).src = src;
  document.getElementById(id_text).style.display = "none";

}

function close_deck(){
  document.getElementById("deck").style.display = "none";
}

function main() {
  console.log("--MAIN--");


  blue_deck['blue_north'] = new Card("bleu", "nord", "N");
  blue_deck['blue_east'] = new Card("bleu", "est", "E");
  blue_deck['blue_south'] = new Card("bleu", "sud", "S");
  blue_deck['blue_west'] = new Card("bleu", "ouest", "W");
  blue_deck['blue_west_x2'] = new Card("bleu", "ouest-x2", "WX2");
  blue_deck['blue_take'] = new Card("bleu", "prendre", "TAKE");
  blue_deck['blue_put'] = new Card("bleu", "deposer", "PUT");
  blue_deck['blue_repulse'] = new Card("bleu", "repousser", "REP");
  blue_deck['blue_undo'] = new Card("bleu", "annuler", "UNDO");
  blue_deck['blue_x2'] = new Card("bleu", "x2", "X2");
  blue_deck['blue_pause'] = new Card("bleu", "pause", "STOP");



  red_deck['red_north'] = new Card("rouge", "nord", "N");
  red_deck['red_east'] = new Card("rouge", "est", "E");
  red_deck['red_south'] = new Card("rouge", "sud", "S");
  red_deck['red_west'] = new Card("rouge", "ouest", "W");
  red_deck['red_east_x2'] = new Card("rouge", "est-x2", "EX2");
  red_deck['red_take'] = new Card("rouge", "prendre", "TAKE");
  red_deck['red_put'] = new Card("rouge", "deposer", "PUT");
  red_deck['red_repulse'] = new Card("rouge", "repousser", "REP");
  red_deck['red_undo'] = new Card("rouge", "annuler", "UNDO");
  red_deck['red_x2'] = new Card("rouge", "x2", "X2");
  red_deck['red_pause'] = new Card("rouge", "pause", "STOP");

  blue_deck['blue_north'].reaction(blueRobot.tabCard, 0);

  red_deck['red_pause'].reaction(redRobot.tabCard, 0);

  console.log(blueRobot.tabCard);
  console.log(redRobot.tabCard);
}

window.addEventListener("resize", refreshPos);

document.addEventListener("DOMContentLoaded", function(e) {
  init();
  main();
});
