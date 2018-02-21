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
    this.flag = 0;
    this.take = false;
    this.put = false;
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
    var adversary;
    if (this.color == "blue") {
      adversary = redRobot;
    }
    else {
      adversary = blueRobot;
    }

    tabBoard[this.row][this.cell] = false;
    if (dir == "N") {
      if (this.row - 1 >= 0 && (this.row - 1 != adversary.row || this.cell != adversary.cell)) {
        this.row -= 1;
        this.heading = "N";
        return "north";
      }
    }
    else if (dir == "E") {
      if (this.cell + 1 <= 8 && (this.row != adversary.row || this.cell + 1 != adversary.cell)) {
        this.cell += 1;
        this.heading = "E";
        return "east";
      }
    }
    else if (dir == "S" && (this.row + 1 != adversary.row || this.cell != adversary.cell)) {
      if (this.row + 1 <= 8) {
        this.row += 1;
        this.heading = "S";
        return "south";
      }
    }
    else if (dir == "W") {
      if (this.cell - 1 >= 0 && (this.row != adversary.row || this.cell - 1 != adversary.cell)) {
        this.cell -= 1;
        this.heading = "W";
        return "west";
      }
    }
    else if (dir == "WX2") {
      if (this.cell - 2 >= 0 && (this.row != adversary.row || this.cell - 2 != adversary.cell)) {
        this.cell -= 2;
        this.heading = "W";
        return "westx2";
      }
    }
    else if (dir == "EX2") {
      if (this.cell + 2 <= 8 && (this.row != adversary.row || this.cell + 2 != adversary.cell)) {
        this.cell += 2;
        this.heading = "E";
        return "eastx2";
      }
    }
    return "idle";
  }

  /* repulse(dir):
   *  Repulses a robot towards it's base
   */
  repulse(dir) {
    var adversary;
    if (this.color == "blue") {
      adversary = redRobot;
    }
    else {
      adversary = blueRobot;
    }

    if (dir == "REPE") {
      if (adversary.cell + 1 <= 8 && (this.row != adversary.row || this.cell != adversary.cell + 1)) {
        adversary.cell += 1;
        adversary.heading = "E";
        adversary.html.setAttribute("class", "east");
      }
    }
    else if (dir == "REPW") {
      if (adversary.cell - 1 >= 0 && (this.row != adversary.row || this.cell != adversary.cell - 1)) {
        adversary.cell -= 1;
        adversary.heading = "W";
        adversary.html.setAttribute("class", "west");
      }
    }
  }

  /* useCard(n):
   *  Triggers the effect of a card
   */
  useCard(n) {
    console.log("Call: useCard("+this.tabCard[n]+")");

    var anim = "";
    switch (this.tabCard[n]) {
      case "N":
        anim = this.move("N");
        this.rotate(this.heading, this.tabCard[n], this.color);
        break;
      case "E":
        anim = this.move("E");
        this.rotate(this.heading, this.tabCard[n], this.color);
        break;
      case "S":
        anim = this.move("S");
        this.rotate(this.heading, this.tabCard[n], this.color);
        break;
      case "W":
        anim = this.move("W");
        this.rotate(this.heading, this.tabCard[n], this.color);
        break;
      case "WX2":
        anim = this.move("WX2");
        this.rotate(this.heading, this.tabCard[n], this.color);
        break;
      case "EX2":
        anim = this.move("EX2");
        this.rotate(this.heading, this.tabCard[n], this.color);
        break;
      case "TAKE": this.take = true; anim = "idle"; break;
      case "PUT": this.put = true; anim = "idle"; break;
      case "REP":
        if (this.color == "blue") {
          this.repulse("REPW");
        }
        else {
          this.repulse("REPE");
        }
        anim = "idle";
        break;
      case "UNDO": anim = "idle"; break;
      case "STOP": anim = "idle"; break;
      default: anim = "idle";
    }

    this.html.setAttribute("class", anim);
  }
}

// A class representing a flag
class Flag {
  constructor(id, color) {
    this.color = color;
    this.row = 0;
    this.cell = 0;
    this.html;
    this.id = id;
    this.taken = false;
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
    this.color = color;
    this.isUsed = false;
    this.action = act;
    this.html = "../images/"+name+"-"+color+".png";
  }

  /* addTo(tabCard, i):
   *  Adds the card to a table at the index i
   */
  addTo(tabCard, i) {
    // If X2 copy the previous card
    if (this.action == "X2") {
      tabCard[i] = tabCard[i-1];
    }
    else {
      tabCard[i] = this.action;
    }
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

  if (redRobot.take) {
    redRobot.take = false;
    if (tabBoard[redRobot.row][redRobot.cell] != false) {
      redRobot.flag = tabBoard[redRobot.row][redRobot.cell];
      tabFlag[redRobot.flag].isTaken = true;
    }
  }

  if (redRobot.put) {
    redRobot.put = false;
    if (redRobot.flag != 0 && tabBoard[redRobot.row][redRobot.cell] == false) {
      tabFlag[redRobot.flag].isTaken = false;
      redRobot.flag = 0;
    }
  }

  if (redRobot.flag != 0) {
    tabFlag[redRobot.flag].row = redRobot.row;
    tabFlag[redRobot.flag].cell = redRobot.cell;
  }

  // Refresh of the redRobot
  var cell = board.rows[redRobot.row].cells[redRobot.cell];
  redRobot.setPos(cell.offsetTop, cell.offsetLeft);

  if (blueRobot.take) {
    blueRobot.take = false;
    if (tabBoard[blueRobot.row][blueRobot.cell] != false) {
      blueRobot.flag = tabBoard[blueRobot.row][blueRobot.cell];
      tabFlag[blueRobot.flag].isTaken = true;
    }
  }

  if (blueRobot.put) {
    blueRobot.put = false;
    if (blueRobot.flag != 0 && tabBoard[blueRobot.row][blueRobot.cell] == false) {
      tabFlag[blueRobot.flag].isTaken = false;
      blueRobot.flag = 0;
    }
  }

  if (blueRobot.flag != 0) {
    tabFlag[blueRobot.flag].row = blueRobot.row;
    tabFlag[blueRobot.flag].cell = blueRobot.cell;
  }

  // Refresh of the blueRobot
  cell = board.rows[blueRobot.row].cells[blueRobot.cell];
  blueRobot.setPos(cell.offsetTop, cell.offsetLeft);

  // Refresh of the flags
  for (var i in tabFlag) {
    if (!tabFlag[i].isTaken) {
      tabBoard[tabFlag[i].row][tabFlag[i].cell] = tabFlag[i].id;
    }

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
  if (blueRobot.tabCard[i] == "UNDO") {
    undo("blue", i);
  }
  else if (redRobot.tabCard[i] == "UNDO") {
    undo("red", i);
  }

  if (blue) {
    blueRobot.useCard(i);
  }
  else {
    redRobot.useCard(i);
  }

  return !blue;
}

/* undo(color, i):
 *  Disable a card of the adversary
 */
function undo(color, i) {
  if (color == "blue") {
    redRobot.tabCard[i] = "STOP";
  }
  else if (color == "red") {
    blueRobot.tabCard[i] = "STOP";
  }
}

/* show_deck(deck, id):
 *
 */
function show_deck(deck, id){
  close_logo();
  var html = "";
  deck_ind = id;

  if (deck == 0) {
    isRed = true;
    html = print_deck(red_deck,temporary_red_hand);
    document.getElementById("deck").style.backgroundColor = "#db6641";
    document.getElementById("deck").style.border = "2px solid #a33614";
  }
  else {
    isRed = false;
    html = print_deck(blue_deck,temporary_blue_hand);
    document.getElementById("deck").style.backgroundColor = "#418cdb";
    document.getElementById("deck").style.border = "2px solid #1449a3";
  }

  document.getElementById("img_deck").innerHTML = html;
  document.getElementById("deck").style.display = "inline-block";
}

/* print_deck(deck, temporary_hand):
 *  Print all deck's card which are not used for each team
 */
function print_deck(deck, temporary_hand) {
  var html = "";
  for (var i in deck) {
    if (temporary_hand.indexOf(i) == -1) {
      html += '<input type="image" onclick="choose_card(\''+i+'\')" class="show_deck" src="'+deck[i].html+'" alt="'+i+'">';
    }
  }
  return html;
}

/* choose_card(ind):
 *  Fill the temporary hand of one team with the chosen card
 */
function choose_card(ind) {
  var id, src, id_text, action;
  if (isRed) {
    id = "red_"+deck_ind;
    id_text = "red_text_"+deck_ind;
    src = red_deck[ind].html;
    temporary_red_hand[deck_ind] = ind;
    document.getElementById("img_deck").innerHTML = print_deck(red_deck, temporary_red_hand);
  }
  else {
    id = "blue_"+deck_ind;
    id_text = "blue_text_"+deck_ind;
    src = blue_deck[ind].html;
    temporary_blue_hand[deck_ind] = ind;
    document.getElementById("img_deck").innerHTML = print_deck(blue_deck, temporary_blue_hand);
  }

  document.getElementById(id).src = src;
  document.getElementById(id_text).style.display = "none";
}

/* close_deck():
 *  Close the div wich contain the deck
 */
function close_deck() {
  document.getElementById("deck").style.display = "none";
}

/* open_logo_choice(color):
 *  Print all the logo available for the team represented by the color
 */
function open_logo_choice(color) {
  close_deck();
  if (color == 0) {
    isRed = true;
    document.getElementById("logo").style.backgroundColor = "#db6641";
    document.getElementById("logo").style.border = "2px solid #a33614";
  }
  else {
    isRed = false;
    document.getElementById("logo").style.backgroundColor = "#418cdb";
    document.getElementById("logo").style.border = "2px solid #1449a3";
  }

  var html = "";
  var div = document.getElementById("selection");

	for (var i = 0; i < localStorage.length; i++) {
		html += '<p class="nom_img"><b>'+localStorage.key(i)+'</b></p>';
		html += '<input type="image" class="list_logo" src="'+localStorage.getItem(localStorage.key(i))+'" onclick="open_logo(\''+localStorage.getItem(localStorage.key(i))+'\')">';
	}

	div.innerHTML = html;
  document.getElementById("logo").style.display = "inline-block";
}

/* open_logo(src):
 *  Draw the chosen logo
 */
function open_logo(src) {
  var logo;
  if (isRed) {
    logo = document.getElementById("red_logo");
  }
  else {
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

/* close_logo():
 *  Close the window with the list of logo
 */
function close_logo() {
  document.getElementById("logo").style.display = "none";
}

/* disable_onclick_deck():
 *  Disable onclick on the deck during turn
 */
function disable_onclick_deck(color) {
  var hand;
  if(color == 0){
      hand = document.getElementsByClassName("red_hand");
  }else{
    hand = document.getElementsByClassName("blue_hand");
  }
  for (var i=0; i < 5; i++){
    hand[i].removeAttribute("onclick");
  }
}

/* enable_onclick_deck(color):
 *   Enable onclick on the deck between turns
 */
function enable_onclick_deck(color) {
  var hand;
  if(color == 0){
      hand = document.getElementsByClassName("red_hand");
  }else{
    hand = document.getElementsByClassName("blue_hand");
  }
  for (var i=0; i < 5; i++){
    hand[i].setAttribute('onclick','show_deck('+color+','+i+');');
  }
}

function printWin(win) {
  var l = document.getElementById("launcher");
  l.style.display = "block";
  l.innerHTML = "<h1>NOUVELLE PARTIE</h1>";
  l.addEventListener("click", function() {
    window.location.reload(false);
  });

  if (win == "WIN_RED") {
    document.getElementById("title").innerHTML = "<h1>Le robot rouge gagne !</h1>";
  }
  else if (win == "WIN_BLUE") {
    document.getElementById("title").innerHTML = "<h1>Le robot bleu gagne !</h1>";
  }
}

/*isReady(color)
* prepare board after a team is ready
*/
function isReady(color){
  var hand, src, tab;
  var id_text;
  var launcher = document.getElementById("launcher");
  var red_ready = document.getElementById("red_ready");
  var blue_ready = document.getElementById("blue_ready");

  if(color == 0){
      hand = document.getElementsByClassName("red_card");
      src="../images/block-vide-rouge.png"
      id_text = "red_text_";
      tab =  temporary_red_hand;
  }else{
      hand = document.getElementsByClassName("blue_card");
      src="../images/block-vide-bleu.png"
      id_text = "blue_text_";
      tab =  temporary_blue_hand;
  }

  close_deck();
  close_logo();

  for(var i = 1; i < 6; i++){
    hand[i].src = src;
    document.getElementById(id_text + (i-1)).style.display = "block";
    if (tab[i-1] == null) {
      alert("La main doit être pleine");
      return;
    }
  }

  if(color == 0){
    red_ready.style.display = "none";
    blue_ready.style.display = "block";
    document.getElementById("blue_turn").style.display = "block";
    document.getElementById("red_turn").style.display = "none";
    disable_onclick_deck(0);
    enable_onclick_deck(1);
  }else{
    blue_ready.style.display = "none";
    launcher.style.display = "block";
    disable_onclick_deck(1);
  }
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
  for (var i = 1; i < 9; ++i) {
    tabFlag[i] = new Flag(i);
    tabFlag[i].html = document.createElement("div");
    att = document.createAttribute("class");

    // First base
    if (i <= 4) {
      // Loop until an empty cell is found
      do {
        r = randInt(4);
        superSwitch(tabFlag[i], r, 0, 3, 1, false);
      } while (tabBoard[tabFlag[i].row][tabFlag[i].cell] != false);

      tabBoard[tabFlag[i].row][tabFlag[i].cell] = i;
      if (i <= 2) {
        tabFlag[i].color = "red"; att.value = "redFlag";
      }
      else {
        tabFlag[i].color = "blue"; att.value = "blueFlag";
      }
    }
    // Second base
    else {
      // Loop until an empty cell is found
      do {
        r = randInt(4);
        superSwitch(tabFlag[i], r, 8, 3, 7, false);
      } while (tabBoard[tabFlag[i].row][tabFlag[i].cell] != false);

      tabBoard[tabFlag[i].row][tabFlag[i].cell] = i;
      if (i <= 6) {
        tabFlag[i].color = "red"; att.value = "redFlag";
      }
      else {
        tabFlag[i].color = "blue"; att.value = "blueFlag";
      }
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

/* launcher():
 *  Test if two hands are full
 */
function launcher() {
  close_deck();
  close_logo();
  console.log("--LAUNCHING--");
  document.getElementById("launcher").style.display = "none";
  main();
}

/* main():
 *  Main loop of the game
 */
function main() {
  console.log("--MAIN--");

  document.getElementById("title").innerHTML = "<h1>Tour en cours</h1>";

  for (var i in temporary_red_hand) {
    red_deck[temporary_red_hand[i]].addTo(redRobot.tabCard, i);
    blue_deck[temporary_blue_hand[i]].addTo(blueRobot.tabCard, i);
  }

  var i = 0;
  var alt = false;
  var int = setInterval(function() {
    var win = checksEnd();
    if (i >= 5 || win == "WIN_RED" || win == "WIN_BLUE") {
      clearInterval(int);
      enable_onclick_deck(0);
      document.getElementById("title").innerHTML = "<h1>Choisissez vos mains</h1>";
      document.getElementById("red_ready").style.display = "block";
      document.getElementById("blue_turn").style.display = "none";
      document.getElementById("red_turn").style.display = "block";

      if (win == "WIN_RED" || win == "WIN_BLUE") {
        printWin(win);
      }
    }
    else {
      if(alt){
        document.getElementById("blue_"+i).src = blue_deck[temporary_blue_hand[i]].html;
        document.getElementById("blue_text_"+i).style.display = "none";
        document.getElementById("blue_turn").style.display = "block";
        document.getElementById("red_turn").style.display = "none";
      }else{
        document.getElementById("red_"+i).src = red_deck[temporary_red_hand[i]].html;
        document.getElementById("red_text_"+i).style.display = "none";
        document.getElementById("blue_turn").style.display = "none";
        document.getElementById("red_turn").style.display = "block";
      }
      alt = useCards(i , alt);
      if (!alt) {
        ++i;
      }
    }
  }, 2000);

}

/* checkEnd():
 *  Checks if someone has won the game
 */
function checksEnd() {
  var redwin = [];
  var bluewin = [];
  for (var i in tabFlag) {
    var cell = board.rows[tabFlag[i].row].cells[tabFlag[i].cell];
    var a = cell.getAttribute("class");

    if (tabFlag[i].color == "red" && a == "redBase") {
      redwin.push(true);
    }
    else if (tabFlag[i].color == "blue" && a == "blueBase") {
      bluewin.push(true);
    }
  }

  if (redwin.length >= 2) {
    return "WIN_RED";
  }
  else if (bluewin.length >= 2) {
    return "WIN_BLUE";
  }

  return "NO";
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

  document.getElementById("launcher").addEventListener("click", function() {
    launcher()
  });
});

/* Every resize of the window calls refreshPos */
window.addEventListener("resize", refreshPos);
