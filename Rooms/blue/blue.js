let canvas = document.getElementById("canvas")

let image = new Image();
//image.src = "../Assets/FRC_PlayingField_blue.png";
image.src = "../Assets/blueField.png";
let field = new Field(image, 775, 820)
//let field = new Field(image, image.width, image.height)
field.setCanvas(canvas)

let grid = new Grid(field.width, field.height, 55, 68)

grid.setCanvas(canvas)

let scoreboard = new ScoreBoard(blueAllianceScore, links, autonScore, teleopScore, coopScore, rankingPoints, telopParking, autonParking)

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
    //console.log("score: " + JSON.stringify(score))
    if(score.team.teamNumber === scoutData.teamNumber)
    {
       
        if(!(JSON.stringify(score.teleopScore) === '{}'))
        {
            
            scoreboard.drawTeleopScore(score.teleopScore.markerScore)
            scoreboard.drawTeleopParkingScore(score.teleopScore.parkingScore)
        }
        if(!(JSON.stringify(score.autonScore) === '{}'))
        {
           //console.log("autonScore: " + JSON.stringify(score.autonScore))
            scoreboard.drawAutonScore(score.autonScore.markerScore)
            scoreboard.drawAutonParkingScore(score.autonScore.parkingScore)
            
        }
    }
    scoreboard.drawCoopScore(score.totalScore.blueCoopScore)
    scoreboard.drawAllianceLinks(score.totalScore.blueAllianceLinks)
    scoreboard.drawRankingPoints(score.totalScore.blueRankingPoints)
    //drawScoreboard(score)
})

function drawScoreboard(scoreboard)
{
    //console.log("scoreboard: " + JSON.stringify(scoreboard));
    document.getElementById("B-point").innerHTML = scoreboard.blueAllianceScore;
    document.getElementById("telop").innerHTML = scoreboard.blueAllianceTelopScore;
}