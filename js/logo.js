document.addEventListener("DOMContentLoaded", function(e) {
  // Récupération des canvas
  var image = document.getElementById("image");
  var ctx_image = image.getContext("2d");

  var layer = document.getElementById("layer");
  var ctx_layer = layer.getContext("2d");
  ctx_layer.globalAlpha = 0.8;

  // Récupération des outils
  var btn_clearImage = document.getElementById("clearImage");

  // Récupération des div textes
  var div_x = document.getElementById("x");
  var div_y = document.getElementById("y");

  // Variables
  var x = 0, y = 0; // Coordonnées du poineur
  var sizePen = 0; // Taille du pinceau
  var isDown = false; // Spécifie le clic gauche est enfoncé

  // Fonction attrapant les coordonnées de la souris
  function getCoordinates(e) {
    // On capture les coordonnées de la souris
    var rect = e.target.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    // On écrit les coordonnées
    div_x.innerHTML = x;
    div_y.innerHTML = y;
  }

  // Fonction dessinant un cercle blanc
  function drawCircle(x, y, size, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  // Mouseenter
  layer.addEventListener("mouseenter", function(e) {
    sizePen = document.getElementById("sizePen").value;
  });

  // Mousemove
  layer.addEventListener("mousemove", function(e) {
    ctx_layer.clearRect(0, 0, layer.width, layer.height);
    getCoordinates(e);
    drawCircle(x, y, sizePen, ctx_layer);

    // Si le clic est enfoncé
    if (isDown) {
      drawCircle(x, y, sizePen, ctx_image);
    }
  });

  // Mouseclick
  layer.addEventListener("click", function(e) {
    getCoordinates(e);
    drawCircle(x, y, sizePen, ctx_image);
  });

  btn_clearImage.addEventListener("click", function(e) {
    ctx_image.clearRect(0, 0, layer.width, layer.height);
  });

  // Mousedown
  layer.addEventListener("mousedown", function(e) {
    // Si le clic gauche est enfoncé
    if (e.buttons == 1) {
      isDown = true;
    }
  });

  // Mouseup
  layer.addEventListener("mouseup", function(e) {
    isDown = false;
  });
});
