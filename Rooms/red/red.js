let scorecard = new ScoreCard(autonScore, teleopScore, autonParking, teleopParking)
let scoreboard = new ScoreBoard(redAllianceScore, blueAllianceScore, totalScore, linksScore, coopScore, rankingPoints)
let superCharged = 0

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

// don't need
// document.getElementById("increment").onclick = () => {
//     if (superCharged >= 0)
//     {
//         superCharged++
//     }
//     document.getElementById("superCharged").value = superCharged
//     socket.emit('inc', 'red')
// }

// document.getElementById("decrement").onclick = () => {
//     if (superCharged > 0)
//     {
//         superCharged--
//     }
//     document.getElementById("superCharged").value = superCharged
//     socket.emit('dec', 'red')
// }