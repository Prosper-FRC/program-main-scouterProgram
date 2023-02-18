let canvas = document.getElementById("canvas")

let image = new Image();
image.src = "../Assets/FRC_PlayingField_blue.png";

let field = new Field(image, 800, 755)
field.setCanvas(canvas)

let grid = new Grid(field.width, field.height, 47, 58)
grid.setCanvas(canvas)

let scoreboard = new ScoreBoard(blueAllianceScore, links, autonScore, teleopScore, coopScore, rankingPoints)

window.onload = function() {
    canvas.width = field.width;
    canvas.height = field.height;
    field.draw()
    grid.draw()
}

canvas.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'blue', grid.getMousePosition(e))
})

socket.on('scoreboard', score => {
    scoreboard.drawAllianceScore(score.blueAllianceScore)
    scoreboard.drawAutonScore(score.blueAllianceAutonScore)
    scoreboard.drawTeleopScore(score.blueAllianceTelopScore)
    scoreboard.drawAllianceLinks(score.blueAllianceLinks)
    //drawScoreboard(score)
})

function drawScoreboard(scoreboard)
{
    //console.log("scoreboard: " + JSON.stringify(scoreboard));
    document.getElementById("B-point").innerHTML = scoreboard.blueAllianceScore;
    document.getElementById("telop").innerHTML = scoreboard.blueAllianceTelopScore;
}