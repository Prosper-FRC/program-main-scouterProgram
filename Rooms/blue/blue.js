let scorecard = new ScoreCard(autonScore, teleopScore, autonParking, teleopParking)
let scoreboard = new ScoreBoard(blueAllianceScore, redAllianceScore, totalScore, linksScore, coopScore, rankingPoints)
let superCharged = 0

canvas.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'blue', grid.getMousePosition(e))
})

socket.on('scoreboard', score => 
{
    scoreboard.renderAllianceScore(score.totalScore.blueAllianceScore)
    scoreboard.renderOpposingScore(score.totalScore.redAllianceScore)

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
    scoreboard.renderCoopScore(score.totalScore.blueCoopScore)
    scoreboard.renderLinksScore(score.totalScore.blueAllianceLinks)
    scoreboard.renderRankingPoints(score.totalScore.blueRankingPoints)
})

document.getElementById("increment").onclick = () => {
    superCharged++
    document.getElementById("superCharged").value = superCharged
    socket.emit('inc', 'blue')
}

document.getElementById("decrement").onclick = () => {
    superCharged--
    document.getElementById("superCharged").value = superCharged
    socket.emit('dec', 'blue')
}