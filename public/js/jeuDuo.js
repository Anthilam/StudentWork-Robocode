/*---CLASSES------------------------------------------------------------------*/
// A class representing a robot
class Robot {
  constructor(c, h) {
    this.color = c;
    this.row = 0;
    this.cell = 0;
    this.html = "";
    this.tabCard = [];
    this.heading = h;
  }

  /* setPos(offsetTop, offsetLeft):
   *  Sets the HTML position of the robot
   */
  setPos(offsetTop, offsetLeft) {
    this.html.style.top = offsetTop + "px";
    this.html.style.left = offsetLeft + "px";
  }

  /* rotate(head, dir, color):
   *  Sets the HTML rotation of the robot
   */
  rotate(head, dir, color) {
    var body, tracks;
    if (color == "blue") {
      body = document.getElementById("blueRobotBody");
      tracks = document.getElementById("blueRobotTracks");
    }
    else {
      body = document.getElementById("redRobotBody");
      tracks = document.getElementById("redRobotTracks");
    }

    var angle;
    switch (head) {
      case "N": angle = -90; break;
      case "E": angle = 0; break;
      case "S": angle = 90; break;
      case "W": angle = 180; break;
      default:;
    }

    body.style.transform = "rotate("+angle+"deg)";
    tracks.style.transform = "rotate("+angle+"deg)";
  }

  /* move(dir):
   *  Moves the robot in a direction
   */
  move(dir) {
    tabBoard[this.row][this.cell] = false;
    if (dir == "N") {
      if (this.row - 1 >= 0 && tabBoard[this.row - 1][this.cell] != true) {
        this.row -= 1;
        this.heading = "N";
        return "north";
      }
    }
    else if (dir == "E") {
      if (this.cell + 1 <= 8 && tabBoard[this.row][this.cell + 1] != true) {
        this.cell += 1;
        this.heading = "E";
        return "east";
      }
    }
    else if (dir == "S" && tabBoard[this.row + 1][this.cell] != true) {
      if (this.row + 1 <= 8) {
        this.row += 1;
        this.heading = "S";
        return "south";
      }
    }
    else if (dir == "W") {
      if (this.cell - 1 >= 0 && tabBoard[this.row][this.cell - 1] != true) {
        this.cell -= 1;
        this.heading = "W";
        return "west";
      }
    }
    return "idle";
  }

  /* useCard(n):
   *  Triggers the effect of a card
   */
  useCard(n) {
    /* TODO GERER LES COLLISIONS ET SORTIE DE TERRAIN */

    console.log("Call: useCard("+this.tabCard[n]+")");

    var anim = "";
    switch (this.tabCard[n]) {
      case "N": anim = this.move("N"); break;
      case "E": anim = this.move("E"); break;
      case "S": anim = this.move("S"); break;
      case "W": anim = this.move("W"); break;
      case "WX2": this.cell -= 2; break;
      case "EX2": this.cell += 2; break;
      case "TAKE": take(); break;
      case "PUT": put(); break;
      case "REP": repulse(); break;
      case "UNDO": undo(); break;
      case "X2": x2(); break;
      case "STOP": stop(); break;
      default: anim = "idle";
    }

    this.rotate(this.heading, this.tabCard[n], this.color);
    this.html.setAttribute("class", anim);
  }
}

// A class representing a flag
class Flag {
  constructor(id) {
    this.row = 0;
    this.cell = 0;
    this.html;
    this.id = id;
  }

  /* setPos(offsetTop, offsetLeft):
   *  Sets the position of the flag
   */
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

  /* addTo(tabCard, i):
   *  Adds the card to a table at the index i
   */
  addTo(tabCard, i) {
    tabCard[i] = this.action;
  }
}

/*---VARIABLES----------------------------------------------------------------*/

var blueRobot = new Robot("blue", "W");
var redRobot = new Robot("red", "E");
// A table containing the flags
var tabFlag = [];
// A boolean table representing which cell of the board is occupied or not
var tabBoard = [[],[],[],[],[],[],[],[],[]];

//Globals vars which represent the two decks
var blue_deck = [];
var red_deck = [];

var temporary_blue_hand = [5];
var temporary_red_hand = [5];

//Var which represent the index of a chosen card in a deck
var deck_ind = -1;

//Var which represent if the player change the red or blue deck
var isRed = true;

/*---DIVERSE FUNCTIONS---------------------------------------------------------*/

/* refreshPos():
 *  Refreshes all the elements position
 */
function refreshPos() {
  var board = document.getElementById("board");

  // Refresh of the redRobot
  tabBoard[redRobot.row][redRobot.cell] = true;
  var cell = board.rows[redRobot.row].cells[redRobot.cell];
  redRobot.setPos(cell.offsetTop, cell.offsetLeft);

  // Refresh of the blueRobot
  tabBoard[blueRobot.row][blueRobot.cell] = true;
  cell = board.rows[blueRobot.row].cells[blueRobot.cell];
  blueRobot.setPos(cell.offsetTop, cell.offsetLeft);

  // Refresh of the flags
  for (var i in tabFlag) {
    tabBoard[tabFlag[i].row][tabFlag[i].cell] = tabFlag[i].id;
    cell = board.rows[tabFlag[i].row].cells[tabFlag[i].cell];
    tabFlag[i].setPos(cell.offsetTop, cell.offsetLeft);
  }
}

/* randInt(max):
 *  Randomizes a number between 0 and max-1
 */
function randInt(max) {
  return Math.floor(Math.random() * max);
}

/* superSwitch(elem, rand, row, cell, other, onside):
 *  Makes a special switch with the parameters given
 */
function superSwitch(elem, rand, row, cell, other, onside) {
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

/* useCards(i, b):
 *  Uses the cards of the two robots alternatively, "blue" specifies which robot
 */
function useCards(i, blue) {
  if (blue) {
    blueRobot.useCard(i);
  }
  else {
    redRobot.useCard(i);
  }

  return !blue;
}

/* show_deck(deck, id):
 *
 */
function show_deck(deck,id){
  close_logo();
  deck_ind = id;
  document.getElementById("deck").style.display = "inline-block";
  document.getElementById("img_deck").innerHTML = "";
  var html;
  console.log(deck);
  if (deck == 0) {
    isRed = true;
    html = print_deck(red_deck,temporary_red_hand);
    document.getElementById("deck").style.backgroundColor = "#db6641";
    document.getElementById("deck").style.border = "2px solid #a33614";
  }else{
    isRed = false;
    html = print_deck(blue_deck,temporary_blue_hand);
    document.getElementById("deck").style.backgroundColor = "#418cdb";
    document.getElementById("deck").style.border = "2px solid #1449a3";
  }
  document.getElementById("img_deck").innerHTML = html;
}

/* print_deck(deck, temporary_hand):
 *Print all deck's card which are not used for each team
 */
function print_deck(deck,temporary_hand){
  var html="";
  for(var i in deck){
    if(temporary_hand.indexOf(i) == -1){
        html += '<input type="image" onclick="choose_card(\''+i+'\')" class="show_deck" src="'+deck[i].html+'" alt="'+i+'">';
    }
  }
  return html;
}

/* choose_card(ind):
 *Fill the temporary hand of one team with the chosen card
 */
function choose_card(ind){
  var id;
  var src;
  var id_text;
  var action;
  if(isRed){
    id = "red_"+deck_ind;
    id_text = "red_text_"+deck_ind;
    src = red_deck[ind].html;
    temporary_red_hand[deck_ind] = ind;
    document.getElementById("img_deck").innerHTML = "";
    document.getElementById("img_deck").innerHTML = print_deck(red_deck,temporary_red_hand);
  }else{
    id = "blue_"+deck_ind;
    id_text = "blue_text_"+deck_ind;
    src = blue_deck[ind].html;
    temporary_blue_hand[deck_ind] = ind;
    document.getElementById("img_deck").innerHTML = "";
    document.getElementById("img_deck").innerHTML = print_deck(blue_deck,temporary_blue_hand);
  }
  document.getElementById(id).src = src;
  document.getElementById(id_text).style.display = "none";

}

/* close_deck():
 *Close the div wich contain the deck
 */
function close_deck(){
  document.getElementById("deck").style.display = "none";
}

/*open_logo_choice(color)
*Print all the logo available for the team represented by the player
*/
function open_logo_choice(color){
  close_deck();
  if(color == 0){
    isRed = true;
    document.getElementById("logo").style.backgroundColor = "#db6641";
    document.getElementById("logo").style.border = "2px solid #a33614";
  }else{
    isRed = false;
    document.getElementById("logo").style.backgroundColor = "#418cdb";
    document.getElementById("logo").style.border = "2px solid #1449a3";
  }
  var html = "";
  var div = document.getElementById("selection");
	//On affiche chaque images avec son nom et une icône de suppression
	for (var i = 0; i < localStorage.length; i++) {
		html += '<p class="nom_img"><b>'+localStorage.key(i)+'</b></p>';
		html += '<input type="image" class="list_logo" src="'+localStorage.getItem(localStorage.key(i))+'" onclick="open_logo(\''+localStorage.getItem(localStorage.key(i))+'\')">';
	}
	div.innerHTML = html;
  document.getElementById("logo").style.display = "block";
}

/*open_logo(src)
*Draw the chosen logo
*/
function open_logo(src){
  var logo;
  if(isRed){
    logo = document.getElementById("red_logo");
  }else{
    logo = document.getElementById("blue_logo");
  }

  var ctxLogo = logo.getContext("2d");
  ctxLogo.clearRect(0, 0, logo.width, logo.height);
	var img = new Image();
    img.onload = function () {
        ctxLogo.drawImage(img, 10, 10, img.width/2, img.height/5);
    };
    img.src = src;
}

/*close_logo()
*Close the window with the list of logo
*/
function close_logo(){
  document.getElementById("logo").style.display = "none";
}




/*---MAIN FUNCTIONS-----------------------------------------------------------*/

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
  var body = document.createElement("div");
  body.setAttribute("id", "redRobotBody");
  redRobot.html.appendChild(body);
  body = document.createElement("div");
  body.setAttribute("id", "redRobotTracks");
  redRobot.html.appendChild(body);
  board_container.appendChild(redRobot.html);
  r = randInt(4);
  superSwitch(redRobot, r, 3, 0, 1, true);

  // blueRobot generation
  blueRobot.html = document.createElement("div");
  blueRobot.html.setAttribute("id", "blueRobot");
  body = document.createElement("div");
  body.setAttribute("id", "blueRobotBody");
  blueRobot.html.appendChild(body);
  body = document.createElement("div");
  body.setAttribute("id", "blueRobotTracks");
  blueRobot.html.appendChild(body);
  board_container.appendChild(blueRobot.html);
  r = randInt(4);
  superSwitch(blueRobot, r, 3, 8, 7, true);

  // Flags generation
  for (var i = 0; i < 8; ++i) {
    tabFlag[i] = new Flag(i);
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
      } while (tabBoard[tabFlag[i].row][tabFlag[i].cell] != false);

      tabBoard[tabFlag[i].row][tabFlag[i].cell] = i;
      (i < 6) ? att.value = "redFlag" : att.value = "blueFlag";
    }

    tabFlag[i].html.setAttributeNode(att);
    board_container.appendChild(tabFlag[i].html);
  }
  //Initialization of the two decks
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

  refreshPos();
}

/*launcher()
*Test if two hands are full
*/
function launcher(){
  for(var i = 0; i < 5; i++){
    if(temporary_red_hand[i] == null || temporary_blue_hand[i] == null){
      return alert("Les deux \"mains\" doivent être pleines");;
    }else{
      close_deck();
      close_logo();
      main();
    }
  }
}

/* main():
 *  Main loop of the game
 */
function main() {
  console.log("--MAIN--");

  blue_deck['blue_north'].addTo(blueRobot.tabCard, 0);
  blue_deck['blue_west'].addTo(blueRobot.tabCard, 1);
  blue_deck['blue_west'].addTo(blueRobot.tabCard, 2);
  blue_deck['blue_west'].addTo(blueRobot.tabCard, 3);
  blue_deck['blue_south'].addTo(blueRobot.tabCard, 4);
  blue_deck['blue_east'].addTo(blueRobot.tabCard, 5);

  red_deck['red_north'].addTo(redRobot.tabCard, 0);
  red_deck['red_east'].addTo(redRobot.tabCard, 1);
  red_deck['red_east'].addTo(redRobot.tabCard, 2);
  red_deck['red_east'].addTo(redRobot.tabCard, 3);
  red_deck['red_south'].addTo(redRobot.tabCard, 4);
  red_deck['red_west'].addTo(redRobot.tabCard, 5);

  var i = 0;
  var alt = true;
  var int = setInterval(function(){
    alt = useCards(i , alt);
    if (alt) {
      ++i;
    }

    if (i >= 5) {
      i = 0;
    }
  }, 2000);
}

/*---EVENT LISTENERS----------------------------------------------------------*/

/* After the DOMContent is loaded */
document.addEventListener("DOMContentLoaded", function(e) {
  /* Initialization of the game */
  init();

  /* Call refreshPos() after the animation of a robot */
  document.getElementById("blueRobot").addEventListener("animationend", function() {
    document.getElementById("blueRobot").removeAttribute("class");
    refreshPos();
  });

  document.getElementById("redRobot").addEventListener("animationend", function() {
    document.getElementById("redRobot").removeAttribute("class");
    refreshPos();
  });

  /* Main loop */
  //main();
});

/* Every resize of the window calls refreshPos */
window.addEventListener("resize", refreshPos);
