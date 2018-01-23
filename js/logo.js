document.addEventListener("DOMContentLoaded", function(e) {
  // Récupération du canvas
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  // Quand la souris bouge sur le canvas
  c.addEventListener("mousemove", function(e) {
    // On capture les coordonnées de la souris
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    // On écrit les coordonnées
    var text = String(x) + " " + String(y);
    ctx.strokeText(text, 10, 10);
  });

  c.addEventListener("click", function(e) {
    // On capture les coordonnées de la souris
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    // On dessine un cercle blanc lorsqu'on clique
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  });

  c.addEventListener("mousedown", function(e) {
    c.addEventListener("mousemove", function(e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      // On dessine un cercle blanc lorsqu'on clique
      ctx.beginPath();
      ctx.arc(x,y,10,0,2*Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
    });
  });
});
