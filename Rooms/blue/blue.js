let canvas = document.getElementById("canvas")

let image = new Image();
//image.src = "../Assets/FRC_PlayingField_blue.png";

//traditional field orientation
image.src = "../Assets/blueField.png";

//flipped field orientation
//image.src = "../Assets/blueField_alt.png"

let field = new Field(image, 775, 820)
//let field = new Field(image, image.width, image.height)
field.setCanvas(canvas)

let grid = new Grid(field.width, field.height, 55, 68)

grid.setCanvas(canvas)

let scoreboard = new ScoreBoard(blueAllianceScore, links, autonScore, teleopScore, coopScore, rankingPoints, telopParking, autonParking, totalScore)

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
        let teamScore = 0
        if(!(JSON.stringify(score.teleopScore) === '{}'))
        {
            
            scoreboard.drawTeleopScore(score.teleopScore.markerScore)
            scoreboard.drawTeleopParkingScore(score.teleopScore.parkingScore)
            teamScore += score.teleopScore.markerScore + score.teleopScore.parkingScore
        }
        if(!(JSON.stringify(score.autonScore) === '{}'))
        {
           //console.log("autonScore: " + JSON.stringify(score.autonScore))
            scoreboard.drawAutonScore(score.autonScore.markerScore)
            scoreboard.drawAutonParkingScore(score.autonScore.parkingScore)
            teamScore += score.autonScore.markerScore + score.autonScore.parkingScore
        }
        scoreboard.drawTotalScore(teamScore)
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