window.addEventListener("unload", deleteUser());

function redirect() {
  window.location = "../index.html";
}

function enterUsr(e) {
  if (e.keyCode === 13) {
    createUser();
  }
}

function createUser() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var user = document.getElementById("pseudo").value;

  request.open("POST", "/chat/"+user, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(user);

  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        localStorage.setItem("user", data.user);
        localStorage.setItem("key", data.key);

        document.getElementById("chat").style.display = "block";
        document.getElementById("newUser").style.display = "none";
        document.getElementById("title").innerHTML += user;

        startGetMsg();
      }
      else {
        document.getElementById("error").innerHTML = "Pseudo incorrect / Un utilisateur possède déjà ce pseudo";
      }
    }
  }
}

function deleteUser() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var user = localStorage.getItem("user");
  var key = localStorage.getItem("key");

  request.open("DELETE", "/chat/"+user+"/"+key, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();

  localStorage.removeItem("user");
  localStorage.removeItem("key");
}

function enterMsg(e) {
  if (e.keyCode === 13) {
    sendMsg();
  }
}

function sendMsg() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var message = document.getElementById("message").value;
  document.getElementById("message").value = "";

  var user = localStorage.getItem("user");
  var key = localStorage.getItem("key");

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

  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("message="+message);
}

function startGetMsg() {
  window.setInterval(getMsg, 2000);
}

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

  var user = localStorage.getItem("user");
  var key = localStorage.getItem("key");
  var msgArea = document.getElementById("msgArea");
  var usrArea = document.getElementById("usrArea");
  var date = new Date();
  date -= 2000;

  request.open("GET", "/chat/"+user+"/"+key+"/"+date, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      var date = new Date();
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

      for (var i in data.general) {
        if (data.general[i].from == null) {
          msgArea.innerHTML += "<div class=\"sys\">" + date + " - (Système) : " + data.general[i].text + "</div>";
        }
        else {
          var text = emojification(data.general[i].text);
          if (data.general[i].from == user) {
            msgArea.innerHTML += "<div class=\"self\">" + date + " - " + data.general[i].from + " : " + text + "</div>";
          }
          else {
            msgArea.innerHTML += "<div>" + date + " - " + data.general[i].from + " : " + text + "</div>";
          }
        }
      }

      for (var i in data.user) {
        var text = emojification(data.user[i].text);
        msgArea.innerHTML += "<div>" + date + " - " + data.user[i].from + " : " + text + "</div>";
      }

      usrArea.innerHTML = "";
      for (var i in data.users) {
        usrArea.innerHTML += "<div>" + data.users[i] + "</div>";
      }
    }
  }
}
