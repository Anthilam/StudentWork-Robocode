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
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      localStorage.setItem("user", data.user);
      localStorage.setItem("key", data.key);
    }
  }

  document.getElementById("chat").style.display = "block";
  document.getElementById("newUser").style.display = "none";
}

function deleteUser() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var user = localStorage.getItem("user");
  var key = localStorage.getItem("key");

  request.open("DELETE", "/chat/"+user+"/"+key, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();

  localStorage.removeItem(user);
  localStorage.removeItem(key);
}

function sendMsg() {
  var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var message = document.getElementById("message").value;

  var user = localStorage.getItem("user");
  var key = localStorage.getItem("key");

  request.open("PUT", "/chat/"+user+"/"+key, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("message="+message);
}
