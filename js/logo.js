// Variables
var x = 0, y = 0, save_x = 0, save_y = 0; // Coordonnées du poineur
var sizePen = 0; // Taille du pinceau
var isDown = false; // Spécifie le clic gauche est enfoncé
var originSet = false; // Spécifie si un point d'origine existe

// Fonction attrapant les coordonnées de la souris
function getCoordinates(e) {
  // On capture les coordonnées de la souris
  var rect = e.target.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
}

// Fonction dessinant un cercle blanc
function drawCircle(x, y, ctx) {
  ctx.beginPath();
  ctx.arc(x, y, sizePen, 0, 2*Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
}

function drawCircleOutline(x, y, ctx) {
  ctx.beginPath();
  ctx.arc(x, y, sizePen, 0, 2*Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Fonction effaçant en cercle
function erase(x, y, ctx) {
  ctx.beginPath();
  ctx.arc(x, y, sizePen, 0, 2*Math.PI);
  ctx.save(); // On sauvegarde le contexte avant clip
  ctx.clip(); // On clip le canvas afin d'appliquer le clear seulement sur la zone voulue
  ctx.clearRect(0, 0, layer.width, layer.width);
  ctx.restore(); // On restaure le contexte, ce qui enlève le clip
}

// Fonction dessinant un trait
function drawStroke(x, y, x2, y2, ctx, save) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle ="white";
  ctx.lineWidth = sizePen;
  ctx.stroke();
  if (!save) {
    save_x = 0;
    save_y = 0;
    originSet = false;
  }
}

// Fonction dessinant un rectangle
function drawRect(x, y, x2, y2, ctx, save) {
  ctx.beginPath();
  ctx.fillStyle="white";
  ctx.fillRect(x2, y2, x-x2, y-y2);
  if (!save) {
    save_x = 0;
    save_y = 0;
    originSet = false;
  }
}

document.addEventListener("DOMContentLoaded", function(e) {
  // Récupération des canvas
  var image = document.getElementById("image");
  var ctx_image = image.getContext("2d");

  var layer = document.getElementById("layer");
  var ctx_layer = layer.getContext("2d");
  ctx_layer.globalAlpha = 0.8;

  // Récupération des outils
  var btn_newImage = document.getElementById("newImage");
  var btn_openImage = document.getElementById("openImage");
  var btn_saveImage = document.getElementById("saveImage");

  // Mouseenter
  layer.addEventListener("mouseenter", function(e) {
    sizePen = document.getElementById("sizePen").value;
  });

  // Mousemove
  layer.addEventListener("mousemove", function(e) {
    ctx_layer.clearRect(0, 0, layer.width, layer.height);
    getCoordinates(e);

    if (originSet) {
      if (document.getElementById("stroke").checked) {
        drawStroke(x, y, save_x, save_y, ctx_layer, 1);
      }
      else if (document.getElementById("rect").checked) {
        drawRect(x, y, save_x, save_y, ctx_layer, 1);
      }
    }
    else {
      if (document.getElementById("eraser").checked) {
        drawCircleOutline(x, y, ctx_layer);
      }
      else {
        drawCircle(x, y, ctx_layer);
        drawCircleOutline(x, y, ctx_layer);
      }

      // Si le clic est enfoncé
      if (isDown) {
        if (document.getElementById("pen").checked) {
          drawCircle(x, y, ctx_image);
        }
        else if (document.getElementById("eraser").checked) {
          erase(x, y, ctx_image);
        }
      }
    }
  });

  // Mouseclick
  layer.addEventListener("click", function(e) {
    getCoordinates(e);
    if (document.getElementById("pen").checked) {
      drawCircle(x, y, ctx_image);
    }
    else if (document.getElementById("eraser").checked) {
      erase(x, y, ctx_image);
    }
    else {
      if (!originSet) {
        save_x = x;
        save_y = y;
        originSet = true;
      }
      else {
        if (document.getElementById("stroke").checked) {
          drawStroke(x, y, save_x, save_y, ctx_image, 0);
        }
        else if (document.getElementById("rect").checked) {
          drawRect(x, y, save_x, save_y, ctx_image, 0);
        }
      }
    }
  });

  btn_newImage.addEventListener("click", function(e) {
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
