window.addEventListener("unload", deleteUser());

function redirect() {
  window.location = "../index.html";
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
        document.getElementById("newUser").innerHTML += "<p>Un utilisateur possède déjà ce pseudo !</p>";
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

function pressEnter(e) {
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
    var to = message.split(":");
    to = to[1].split(" ");
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
          msgArea.innerHTML += "<p>" + date + " - (Système) : " + data.general[i].text + "</p>";
        }
        else {
          msgArea.innerHTML += "<p>" + date + " - " + data.general[i].from + " : " + data.general[i].text + "</p>";
        }
      }

      for (var i in data.user) {
        msgArea.innerHTML += "<p>" + date + " - " + data.user[i].from + " : " + data.user[i].text + "</p>";
      }

      usrArea.innerHTML = "";
      for (var i in data.users) {
        usrArea.innerHTML += "<p>" + data.users[i] + "</p>";
      }
    }
  }
}
