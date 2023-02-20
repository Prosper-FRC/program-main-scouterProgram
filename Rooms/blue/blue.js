let canvas = document.getElementById("canvas")

let image = new Image();
//image.src = "../Assets/FRC_PlayingField_blue.png";
image.src = "../Assets/blueField.png";
let field = new Field(image, 775, 820)
//let field = new Field(image, image.width, image.height)
field.setCanvas(canvas)

let grid = new Grid(field.width, field.height, 55, 68)

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
    
    scoreboard.drawAllianceScore(score.totalScore.blueAllianceScore)
    //console.log("team: " + scoutData.teamNumber + " TeamWithScore: " + score.team.teamNumber)
    if(score.team.teamNumber === scoutData.teamNumber){
        //console.log("Team: " + scoutData.teamNumber + " Team Auton Marker: " + score.team.autonMarkerScore)
        scoreboard.drawAutonScore(score.team.autonMarkerScore)
    }
    scoreboard.drawTeleopScore(score.totalScore.blueAllianceTelopScore)
    scoreboard.drawAllianceLinks(score.totalScore.blueAllianceLinks)
    //drawScoreboard(score)
})

function drawScoreboard(scoreboard)
{
    //console.log("scoreboard: " + JSON.stringify(scoreboard));
    document.getElementById("B-point").innerHTML = scoreboard.blueAllianceScore;
    document.getElementById("telop").innerHTML = scoreboard.blueAllianceTelopScore;
}