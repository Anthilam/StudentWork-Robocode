function redirect() {
  window.location = "../index.html";
}

function createUser() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var user = document.getElementById("pseudo").value;

  request.open("POST", "/chat/"+user, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(user);

  document.getElementById("chat").style.display = "block";
  document.getElementById("newUser").style.display = "none";
  document.getElementById("title").innerHTML += user;

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      localStorage.setItem("user", data.user);
      localStorage.setItem("key", data.key);

      startGetMsg();
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

function sendMsg() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var message = document.getElementById("message").value;
  document.getElementById("message").value = "";

  var user = localStorage.getItem("user");
  var key = localStorage.getItem("key");

  request.open("PUT", "/chat/"+user+"/"+key, true);
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
      for (var i in data.general) {
        msgArea.innerHTML += "<p>" + data.general[i].from + " - " + data.general[i].text + "</p>";
      }

      for (var i data.user) {
        msgArea.innerHTML += "<p>" + data.user[i].from + " - " + data.user[i].text + "</p>";
      }

      usrArea.innerHTML = "";
      for (var i in data.users) {
        usrArea.innerHTML += "<p>" + data.users[i] + "</p>";
      }
    }
  }
}
