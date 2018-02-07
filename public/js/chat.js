// Au déchargement de la page on déconnecte/supprime l'utilisateur
window.addEventListener("unload", deleteUser());

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
        document.getElementById("title").innerHTML += user;
        // Lancement de la fonction de récupération des messages
        startGetMsg();
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
  else {
    request.open("PUT", "/chat/"+user+"/"+key, true);
  }

  // Envoi de la requête
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("message="+message);
}

// Fonction lançant la récupération des messages avec un intervalle de 2s
function startGetMsg() {
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
