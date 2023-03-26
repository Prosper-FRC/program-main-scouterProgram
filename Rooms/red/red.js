let canvas = document.getElementById("canvas")

let image = new Image();

//traditional field orientation
image.src = "../Assets/redField.png";

//flipped field orientation
//image.src = "../Assets/redField_alt.png"

let field = new Field(image, 775, 820)
field.setCanvas(canvas)

let grid = new Grid(field.width, field.height, 55, 68)
grid.setCanvas(canvas)

let scorecard = new ScoreCard(autonScore, teleopScore, autonParking, teleopParking)
let scoreboard = new ScoreBoard(redAllianceScore, blueAllianceScore, totalScore, linksScore, coopScore, rankingPoints)

window.onload = function() {
    canvas.width = field.width;
    canvas.height = field.height;
    field.draw()
    grid.draw()
}

canvas.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'red', grid.getMousePosition(e))
})

socket.on('scoreboard', score => 
{
    scoreboard.renderAllianceScore(score.totalScore.redAllianceScore)
    scoreboard.renderOpposingScore(score.totalScore.blueAllianceScore)

    if(score.team.teamNumber === scoutData.teamNumber)
    {
        let teamScore = 0
        if(!(JSON.stringify(score.teleopScore) === '{}'))
        {
            scorecard.renderTeleopScore(score.teleopScore.markerScore)
            scorecard.renderTeleopParkingScore(score.teleopScore.parkingScore)
            teamScore += score.teleopScore.markerScore + score.teleopScore.parkingScore
        }
        if(!(JSON.stringify(score.autonScore) === '{}'))
        {
            scorecard.renderAutonScore(score.autonScore.markerScore)
            scorecard.renderAutonParkingScore(score.autonScore.parkingScore)
            teamScore += score.autonScore.markerScore + score.autonScore.parkingScore
        }
        scoreboard.renderTotalScore(teamScore)
    }
    scoreboard.renderLinksScore(score.totalScore.redAllianceLinks)
    scoreboard.renderCoopScore(score.totalScore.redCoopScore)
    scoreboard.renderRankingPoints(score.totalScore.redRankingPoints)
})