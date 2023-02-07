let canvas = document.getElementById("canvas")

let image = new Image();
image.src = "Assets/FRC_PlayingField_red.png";

let field = new Field(image, 800, 755)
field.setCanvas(canvas)

let grid = new Grid(field.width, field.height, 47, 58)
grid.setCanvas(canvas)

let scoreboard = new ScoreBoard()

window.onload = function() {
    canvas.width = field.width;
    canvas.height = field.height;
    field.draw()
    grid.draw()
}

canvas.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'red', grid.getMousePosition(e))
})