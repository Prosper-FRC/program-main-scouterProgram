let canvas = document.getElementById("canvas")

let image = new Image();
image.src = "../Assets/redField.png";

let field = new Field(image, 775, 820)
field.setCanvas(canvas)

let grid = new Grid(field.width, field.height, 55, 68)
grid.setCanvas(canvas)

let scoreboard = new ScoreBoard(redAllianceScore, links, autonScore, teleopScore, coopScore, rankingPoints, telopParking, autonParking)

window.onload = function() {
    canvas.width = field.width;
    canvas.height = field.height;
    field.draw()
    grid.draw()
}

canvas.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'red', grid.getMousePosition(e))
})

socket.on('scoreboard', score => {
    console.log(JSON.stringify(score))
    scoreboard.drawAllianceScore(score.totalScore.redAllianceScore)
    if(score.team.teamNumber === scoutData.teamNumber)
    {
       
        if(!(JSON.stringify(score.teleopScore) === '{}'))
        {
            
            scoreboard.drawTeleopScore(score.teleopScore.markerScore)
            scoreboard.drawTeleopParkingScore(score.teleopScore.parkingScore)
        }
        if(!(JSON.stringify(score.autonScore) === '{}'))
        {
          //  console.log("autonScore: " + JSON.stringify(score.autonScore))
            scoreboard.drawAutonScore(score.autonScore.markerScore)
            scoreboard.drawAutonParkingScore(score.autonScore.parkingScore)
        }
    }
    //scoreboard.drawTeleopScore(score.totalScore.redAllianceTelopScore)
    scoreboard.drawAllianceLinks(score.totalScore.redAllianceLinks)
    scoreboard.drawCoopScore(score.totalScore.redCoopScore)
    scoreboard.drawRankingPoints(score.totalScore.redRankingPoints)
})