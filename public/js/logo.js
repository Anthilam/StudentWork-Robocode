// Timothée Guy - 2018

// Variables
var x = 0, y = 0, save_x = 0, save_y = 0; // Coordonnées du poineur
var sizePen = 0; // Taille du pinceau
var color = "#FFFFFF"; // Couleur du pinceau
var isDown = false; // Spécifie le clic gauche est enfoncé
var originSet = false; // Spécifie si un point d'origine existe
var tab_img = []; // Tableau contenant le nom des image enregistrées

// Fonction capturant les coordonnées de la souris
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
  ctx.fillStyle = color;
  ctx.fill();
}

// Fonction dessinant un cercle sans fond
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
function drawStroke(x, y, x2, y2, ctx) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = sizePen;
  ctx.stroke();
}

// Fonction dessinant un rectangle
function drawRect(x, y, x2, y2, ctx) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x2, y2, x-x2, y-y2);
}

// Fonction vidant un contexte passé en paramètres
function clearCtx(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function closeOpenImage() {
  var savedImg = document.getElementById("savedImg");
  savedImg.style.display = "none";
  // Suppression de la liste du DOM au cas où celle-ci change
  var list = document.getElementById("ul_img");
  list.remove();
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
  var btn_closeOpenImage = document.getElementById("closeOpenImage");

  // Mouseenter
  layer.addEventListener("mouseenter", function(e) {
    // Capture de la taille et la couleur du pinceau
    sizePen = document.getElementById("sizePen").value;
    color = document.getElementById("colorPen").value;
  });

  // Mousemove
  layer.addEventListener("mousemove", function(e) {
    clearCtx(ctx_layer, layer); // Clear du contexte calque
    getCoordinates(e);

    // Si un point d'origine est présent, on dessine la forme en conséquence
    if (originSet) {
      if (document.getElementById("stroke").checked) {
        drawStroke(x, y, save_x, save_y, ctx_layer);
      }
      else if (document.getElementById("rect").checked) {
        drawRect(x, y, save_x, save_y, ctx_layer);
      }
    }
    else {
      // Si on veut dessiner un rect ou un trait, on change le curseur pour une meilleure précision
      if (document.getElementById("rect").checked || document.getElementById("stroke").checked) {
        document.getElementById("layer").style.cursor = "crosshair";
      }
      // Sinon on dessine le cercle du pinceau/gomme
      else {
        document.getElementById("layer").style.cursor = "none";
        if (document.getElementById("pen").checked) {
          drawCircle(x, y, ctx_layer);
        }
        drawCircleOutline(x, y, ctx_layer);
      }

      // Si le clic est enfoncé, on agit en conséquence
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

    // Clic pinceau
    if (document.getElementById("pen").checked) {
      drawCircle(x, y, ctx_image);
    }
    // Clic gomme
    else if (document.getElementById("eraser").checked) {
      erase(x, y, ctx_image);
    }
    // Clic rectangle/trait
    else {
      // Si il n'y a pas de point d'origine, on le "crée"
      if (!originSet) {
        save_x = x;
        save_y = y;
        originSet = true;
      }
      // Sinon on dessine la forme voulue puis on "détruit" le point d'origine
      else {
        if (document.getElementById("stroke").checked) {
          drawStroke(x, y, save_x, save_y, ctx_image);
        }
        else if (document.getElementById("rect").checked) {
          drawRect(x, y, save_x, save_y, ctx_image);
        }
        save_x = 0;
        save_y = 0;
        originSet = false;
      }
    }
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

  // btn_newImage
  btn_newImage.addEventListener("click", function(e) {
    clearCtx(ctx_image, image); // On clear le contexte image
  });

  // btn_saveImage
  btn_saveImage.addEventListener("click", function(e) {
    // On demande à l'utilisateur de nommer l'image
    var name = prompt("Donnez un nom à l'image", "");
    if (name != null) {
      // On stocke l'image dans le localStorage
      localStorage.setItem(name, image.toDataURL("image/png"));
      // On stocke le nom de l'image pour réutilisation
      tab_img.push(name);
    }
  });

  // btn_openImage
  btn_openImage.addEventListener("click", function(e) {
    // Affichage de la div contenant la liste des images enregistrées
    var savedImg = document.getElementById("savedImg");
    savedImg.style.display = "block";

    // Création de la liste dans le DOM
    var div_list = document.getElementById("div_list");
    var list = document.createElement("ul");
    var att = document.createAttribute("id");
    att.value = "ul_img";
    list.setAttributeNode(att);
    div_list.appendChild(list);

    // Création des éléments de la liste dans le DOM
    tab_img.forEach(function(i) {
      // Chaque élément de la liste a pour id le nom de l'image
      var elem = document.createElement("li");
      att = document.createAttribute("id");
      att.value = i;
      elem.setAttributeNode(att);
      list.appendChild(elem);

      // Création du nom de l'image
      var t = document.createTextNode(i);
      elem.appendChild(t);

      // Création des images
      var img = document.createElement("img");
      img.src = localStorage.getItem(i);
      elem.appendChild(img);
      // Ajout d'un évènement si on clic sur l'image
      img.addEventListener("click", function(e) {
        clearCtx(ctx_image, image); // Clear du contexte image
        // Ajout de l'image au contexte image
        var base_img = new Image();
        base_img.onload = function() {
          ctx_image.drawImage(base_img, 0, 0);
        }
        base_img.src = img.src;
        closeOpenImage();
      });

      // Création du bouton de suppression
      var del = document.createElement("img");
      att = document.createAttribute("class");
      att.value = "delete";
      del.setAttributeNode(att);
      del.src = "../images/icone-supprimer.png";
      elem.appendChild(del);
      // Ajout de l'évènement de suppression au clic
      del.addEventListener("click", function(e) {
        document.getElementById(i).remove(); // On enlève l'élément de la liste
        localStorage.removeItem(i); // On enlève l'image du localStorage
        // On enlève l'image de tab_img
        var found = tab_img.findIndex(function (e) { return e === i;});
        tab_img.splice(found,1);
      });
    });
  });

  // btn_closeOpenImage fermant la liste ouverte lors du clic sur btn_openImage
  btn_closeOpenImage.addEventListener("click", function(e) {
    closeOpenImage();
  });
});
