let justPressed = false;

//Event listeners for the arrow keys
function userClicks(){
    canvas.addEventListener("mousedown", function(e)
    {
        getMousePosition(canvasElem, e);
    });

    
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let marker = {
        x: Math.floor((x/(canvas.width/20))),
        y: Math.floor((y/(canvas.height/16))),
        markerColor: scoutData.markerColor
    }
    console.log("x: " + marker.x +  "/n " + "y: " + marker.y);
    //console.log("test");
    socket.emit('drawMarker', marker);
    // placeMarker(canvas, Math.floor((x/(canvas.width/20))), Math.floor((y/(canvas.height/16))));
}
}
/*function placeMarker(canvas, x, y, markerColor)
{
    var ctx = canvas.getContext("2d");
    var width = canvas.width/20;
    var height = canvas.height/16
    var posx = x*width ;
    var posy = y*height;
    ctx.fillStyle = markerColor;
    ctx.fillRect(posx+3,posy+3,width-2, height-2);

}*/

//}