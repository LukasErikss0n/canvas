var  canvas = document.getElementById("mycanvas")
var ctx =  canvas.getContext("2d")
var grd = ctx.createLinearGradient(0, 0, 5, 13);
grd.addColorStop(0, "blue");
grd.addColorStop(1, "yellow");

ctx.fillStyle = grd;
ctx.fillRect (0,0,20,20)
ctx.fill()



