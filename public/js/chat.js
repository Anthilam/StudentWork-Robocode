// Au déchargement de la page on déconnecte/supprime l'utilisateur
window.addEventListener("unload", deleteUser());


/*Timothée Guy Reynald Barbeaut
*/

//Boolans which allow to test if player joined or created the game
var hasJoined = false;
var hasCreated = false

var idGame = "";
//Var wich contain the name of the host of the game
var host = "";

online = true;
//Id of a set interval
var IdInterval = 0;

// Fonction de redirection vers la page index
function redirect() {
  window.location = "../index.html";
}

// Fonction capturant l'appui de la touche entrée dans l'input text de l'user
function enterUsr(e) {
  if (e.keyCode === 13) {
    createUser();
  }
}

// Fonction capturant l'appui de la touche entrée dans l'input text du chat
function enterMsg(e) {
  if (e.keyCode === 13) {
    sendMsg();
  }
}

// Fonction de création d'un utilisateur
function createUser() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  // Récupération du nom entré dans l'input text
  var user = document.getElementById("pseudo").value;
  // Création et envoi de la requête
  request.open("POST", "/chat/"+user, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(user);

  // Récupération et traitement du JSON
  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      // Si la réponse est ok
      if (this.status == 200) {
        // Stockage des données utilisateur dans le sessionStorage
        var data = JSON.parse(this.responseText);
        sessionStorage.setItem("user", data.user);
        sessionStorage.setItem("key", data.key);
        // Affichage du chat
        document.getElementById("chat").style.display = "block";
        document.getElementById("newUser").style.display = "none";
        document.getElementById("title_chat").innerHTML += user;
        // Lancement de la fonction de récupération des messages
        startGetMessage();
      }
      // Sinon affichage d'un message d'erreur
      else {
        document.getElementById("error").innerHTML = "Pseudo incorrect / Un utilisateur possède déjà ce pseudo";
      }
    }
  }
}

// Fonction de déconnexion/suppression d'un utilisateur
function deleteUser() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  // Récupération des données utilisateur
  var user = sessionStorage.getItem("user");
  var key = sessionStorage.getItem("key");
  // Création et envoi de la requête
  request.open("DELETE", "/chat/"+user+"/"+key, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();
  // Suppression des données utilisateur du sessionStorage
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("key");
}

// Fonction d'envoi d'un message dans le chat
function sendMsg() {
  // Création de la requête
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  // Récupération du message entré dans l'input text
  var message = document.getElementById("message").value;
  document.getElementById("message").value = "";
  // Récupération des données utilisateur
  var user = sessionStorage.getItem("user");
  var key = sessionStorage.getItem("key");

  // Création de la requête en fonction de la présence de /to: en début de message
  var match = /^\/to:*/g.exec(message);
  if (match != null) {
    var to = message.split(/:(.+)/);
    to = to[1].split(/ (.+)/);
    request.open("PUT", "/chat/"+user+"/"+key+"/"+to[0], true);
    message = to[1];
  }

  // Création de la requête en fonction de la présence de /invite: en début de message
  var invite = /^\/invite:*/g.exec(message);
  if (invite != null && !hasJoined && !hasCreated) {
    var to = message.split(/:(.+)/);
    to = to[1].split(/ (.+)/);
    if(to[0] == user){
      alert("Impossible de s'inviter soit même à une partie !")
      return;
    }
    host = user;
    hasCreated = true;
    idGame = "party_of_"+user;
    request.open("PUT", "/invite/"+user+"/"+key+"/"+to[0]+"/"+idGame, true);
    message = "Invitation de "+user+" tapez /join:"+user+" pour rejoindre.";
  }


  // Création de la requête en fonction de la présence de /join: en début de message
  var join = /^\/join:*/g.exec(message);
  if (join != null && !hasJoined && !hasCreated) {
    var to = message.split(/:(.+)/);
    to = to[1].split(/ (.+)/);
    host = to[0];
    idGame = "party_of_"+host;
    request.open("PUT", "/join/"+user+"/"+key+"/"+to[0], true);
    message = user+" a accepté de rejoindre votre partie";
    hasJoined = true;
  }

  if(match == null && invite == null && join == null){
    request.open("PUT", "/chat/"+user+"/"+key, true);
  }


  // Envoi de la requête
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("message="+message);
  if(hasJoined || hasCreated){
    setTimeout(display_game(), 3000);
    getGame();
  }
}

// Fonction lançant la récupération des messages avec un intervalle de 2s
function startGetMessage() {
  window.setInterval(getMsg, 2000);
}



// Fonction convertissant certains patterns de caractères en emojis
function emojification(text) {
  var txt = text
    .replace(/:D/g, "<div class=\"emoji happy\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:zzz:/g, "<div class=\"emoji sleepy\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:love:/g, "<div class=\"emoji love\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:lookup:/g, "<div class=\"emoji lookup\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:angry:/g, "<div class=\"emoji angry\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:\(/g, "<div class=\"emoji sad\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:\)/g, "<div class=\"emoji smile\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:grin:/g, "<div class=\"emoji grin\"><img src=\"../images/emoji.png\"></div>")
    .replace(/:sick:/g, "<div class=\"emoji sick\"><img src=\"../images/emoji.png\"></div>");

  return txt;
}


function getGame(){
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  // Récupération des données utilisateur
  var user = sessionStorage.getItem("user");
  var key = sessionStorage.getItem("key");

  // Création et envoi de la requête

  request.open("GET", "/game/"+user+"/"+key+"/"+idGame, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();
  // Récupération et traitement du JSON
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Parsing du JSON
      var data = JSON.parse(this.responseText);
      console.log(data);
      if(data.blueRobot != ''){
        fill_deck(0,data.redDeck);
        fill_deck(1,data.blueDeck);
        fill_robot(JSON.parse(data.blueRobot));
        fill_robot(JSON.parse(data.redRobot));
        fill_tab_flag(JSON.parse(data.tabFlag));
        tabBoard = JSON.parse(data.tabBoard);
        setTimeout(refreshPos(), 1000);
      }
    }
  }
  if(temporary_red_hand.length == 5 && temporary_blue_hand.length == 5){
    window.clearInterval(IdInterval);
    main();
  }
}
//Fill all the attribute of a robot
function fill_robot(robot){
  if(robot.color == "blue"){
    blueRobot.row = robot.row;
    blueRobot.cell = robot.cell;
    blueRobot.heading = robot.heading;
    blueRobot.flag = robot.flag;
    blueRobot.put = robot.put;
    blueRobot.take = robot.take;
  }else{
    redRobot.row = robot.row;
    redRobot.cell = robot.cell;
    redRobot.heading = robot.heading;
    redRobot.flag = robot.flag;
    redRobot.put = robot.put;
    redRobot.take = robot.take;

  }
}

//Fill the table of flags
function fill_tab_flag(tab){
  for(var i = 1; i < tab.length; i++){
    tabFlag[i].cell = tab[i].cell;
    tabFlag[i].color = tab[i].color;
    tabFlag[i].id = tab[i].id;
    tabFlag[i].row = tab[i].row;
    tabFlag[i].isTaken = tab[i].isTaken;
  }
}


//Fill a deck
function fill_deck(color, deck){
  if(deck ==''){
    return;
  }
  for(var i = 0; i < 5; i++){
    if(color == 0){
      temporary_red_hand[i] = JSON.parse(deck)[i];
    }else{
      temporary_blue_hand[i] = JSON.parse(deck)[i];
    }
  }
}


//Display the game board dependung on
function display_game(){
  document.getElementById("main").style.display = "block";
  init();
  if(hasJoined){
    disable_onclick_deck(0);
    enable_onclick_deck(1);
    display_side(1);
  }
  if(hasCreated){
    disable_onclick_deck(1);
    enable_onclick_deck(0);
    display_side(0);
    sendInfo();
  }
  document.getElementById("red_turn").style.display = "none";
  document.getElementById("blue_turn").style.display = "none";

}

function sendDeck(){
  var hand, src, tab;
  var id_text;

  if(hasCreated){
      hand = document.getElementsByClassName("red_card");
      src="../images/block-vide-rouge.png"
      id_text = "red_text_";
      tab =  temporary_red_hand;
  }

  if(hasJoined){
      hand = document.getElementsByClassName("blue_card");
      src="../images/block-vide-bleu.png"
      id_text = "blue_text_";
      tab =  temporary_blue_hand;
  }

  close_deck();
  close_logo();

  for(var i = 1; i < 6; i++){
    if (tab[i-1] == null) {
      alert("La main doit être pleine");
      return;
    }
    hand[i].src = src;
    document.getElementById(id_text + (i-1)).style.display = "block";
  }
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

  if(hasJoined){
    request.open("PUT", "/tab/"+idGame+"/blue/"+JSON.stringify(tab), true);
    document.getElementById('blue_ready').style.display = "none";
    disable_onclick_deck(1);
  }
  if(hasCreated){
    request.open("PUT", "/tab/"+idGame+"/red/"+JSON.stringify(tab), true);
    document.getElementById('red_ready').style.display = "none";
    disable_onclick_deck(0);
  }
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();
  startGetGame();
}

function startGetGame(){
  IdInterval = window.setInterval(getGame, 2000);
}


/*sendInfo
*Functio that send robots, flag, board and the decks to the server
*/
function sendInfo(){
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var blue = JSON.stringify(blueRobot);
  var red = JSON.stringify(redRobot);
  var flag = JSON.stringify(tabFlag);
  var board = JSON.stringify(tabBoard);
  request.open("PUT", "/info/"+idGame+"/"+blue+"/"+red+"/"+flag+"/"+board, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();
}


function getMsg() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  // Récupération des données utilisateur
  var user = sessionStorage.getItem("user");
  var key = sessionStorage.getItem("key");
  // Récupération des zones d'affichage
  var msgArea = document.getElementById("msgArea");
  var usrArea = document.getElementById("usrArea");
  // Création de l'objet date
  var date = new Date();
  date -= 2000;

  // Création et envoi de la requête
  request.open("GET", "/chat/"+user+"/"+key+"/"+date, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();

  // Récupération et traitement du JSON
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Parsing du JSON
      var data = JSON.parse(this.responseText);

      // Création d'une date conforme
      date = new Date();
      var hours = date.getHours();
      if (hours < 10) {
        hours = "0"+hours;
      }
      var minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = "0"+minutes;
      }
      var seconds = date.getSeconds();
      if (seconds < 10) {
        seconds = "0"+seconds;
      }
      date = hours + ":" + minutes + ":" + seconds;

      // Affichage des messages généraux
      for (var i in data.general) {
        // Affichage des messages systèmes
        if (data.general[i].from == null) {
          msgArea.innerHTML += "<div class=\"sys\">" + date + " - (Système) : " + data.general[i].text + "</div>";
        }
        // Autres messages
        else {
          // Ajout des emojis
          var text = emojification(data.general[i].text);
          if (data.general[i].from == user) {
            // Ajout de la classe self affichant les messages de l'utilisateur courant en vert
            msgArea.innerHTML += "<div class=\"self\">" + date + " - " + data.general[i].from + " : " + text + "</div>";
          }
          else {
            msgArea.innerHTML += "<div>" + date + " - " + data.general[i].from + " : " + text + "</div>";
          }
        }
      }

      // Affichage des messages privés
      for (var i in data.user) {
        // Ajout des emojis
        var text = emojification(data.user[i].text);
        // Affichage des messages
        msgArea.innerHTML += "<div>" + date + " - " + data.user[i].from + " : " + text + "</div>";
      }

      // Affichage des utilisateurs connectés
      usrArea.innerHTML = "";
      for (var i in data.users) {
        usrArea.innerHTML += "<div>" + data.users[i] + "</div>";
      }
    }
  }
}
