const gp = require("./gamePieces")

function TileScores(x, y) {
    let score = 0
    if (y >= 3) {
        switch (x) {
            case 0:
                score = 5
                break
            case 1:
                score = 3
                break
            case 2:
                score = 2
                break
            default:
                score = 0
                break
        }
    }

    return score
}
function TileScoresAlt(x, y) {
    let score = 0
    if (y >= 3) {
        switch (x) {
            case 11:
                score = 2
                break
            case 12:
                score = 3
                break
            case 13:
                score = 5
                break
            default:
                score = 0
                break
        }
    }

    return score
}
// function not being used
// function CoopScores(x,y)
// {
//     let score = 0;
//     if(y > 5 && y < 9)
//     {
//         switch(x)
//         {
//             case 0:
//                 score = 6;
//                 break;
//             case 1:
//                 score = 4;
//                 break;
//             case 2:
//                 score = 3;
//                 break;
//             default:
//                 score = 0;
//                 break;
//         }
//     }

//     return score;
// }
// function not being used
// function CoopScoresAlt(x,y)
// {
//     let score = 0;
//     if(y >= 3)
//     {
//         switch(x)
//         {
//             case 12:
//                 score = 3;
//                 break;
//             case 13:
//                 score = 4;
//                 break;
//             case 14:
//                 score = 6;
//                 break;
//             default:
//                 score = 0;
//                 break;
//         }
//     }

//     return score;
// }

class ScoreBoard {
    constructor() {
        this.Score = 0
        this.TeleopScore = 0
        this.AutonScore = 0
        this.AmpScore = 0
        this.AmpCount = 0
        this.SpeakerScore = 0
        this.SpeakerCount = 0
        this.TrapScore = 0
        this.TrapCount = 0
        this.MobileScore = 0
        this.OnStageScore = 0
        this.SpotlightScore = 0
        this.ParkingScore = 0
        this.HarmonyScore = 0
    }
    clearAll() {
        this.Score = 0
        this.TeleopScore = 0
        this.AutonScore = 0
        this.AmpScore = 0
        this.AmpCount = 0
        this.SpeakerScore = 0
        this.SpeakerCount = 0
        this.TrapScore = 0
        this.TrapCount = 0
        this.MobileScore = 0
        this.OnStageScore = 0
        this.SpotlightScore = 0
        this.ParkingScore = 0
        this.HarmonyScore = 0
    }
}

class ScoreLive {
    constructor() {
        this.sb = new ScoreBoard()
    }

    UpdateMarkers(auton_markers, teleop_markers, team) {
        this.sb.clearAll();
        team.autonScore.clearAll();
        team.teleopScore.clearAll();
        // check the score based coordss

        /** Scoring Instructions * */

        /** Scoring Instructions * */

        // 1. Loop Through Auton Markers
        // 2. Check the marker type of each marker
        // 3. Switch
        // If markerType == 'mobile'
        for (let marker in auton_markers) {
            switch(auton_markers[marker].markerType)
            {
                case "mobile": 
                    this.sb.AutonScore += 2
                    this.sb.MobileScore += 2
                    team.ScoreBoard.MobileScore += 2
                    team.ScoreBoard.AutonScore += 2
                break;
                case "Amplifier": // Handle Auton Scoring
                    this.sb.AmpScore += 2
                    this.sb.AutonScore += 2
                    this.sb.AmpCount += 1
                    team.autonScore.AmpScore += 2
                    team.autonScore.AutonScore += 2
                    team.autonScore.AmpCount += 1
                    break;
                case "Speaker": 
                    this.sb.AutonScore += 5
                    this.sb.SpeakerScore += 5
                    this.sb.SpeakerCount += 1
                    team.autonScore.AutonScore += 5
                    team.autonScore.SpeakerScore += 5
                    team.autonScore.SpeakerCount += 1
                    break;
                case "Trap":
                    this.sb.AutonScore += 5
                    this.sb.TrapScore += 5
                    this.sb.TrapCount += 1
                    team.autonScore.TrapScore += 5
                    team.autonScore.TrapCount += 1
                    team.autonScore.AutonScore += 1
                    break;
                default:
                    break;
            }
        }
        for (let marker in teleop_markers) {

            if (
                teleop_markers[marker].markerType == "Speaker"
                // teleop_markers[marker].ampState != "Amplified"
            ) {
                this.sb.TeleopScore += 2
                this.sb.SpeakerScore += 2
                this.sb.SpeakerCount += 1
                team.teleopScore.SpeakerCount += 1
                team.teleopScore.TeleopScore += 2
                team.teleopScore.SpeakerScore += 2
                
            }

            if (teleop_markers[marker].markerType == "Amplifier") {
                this.sb.TeleopScore += 1
                this.sb.AmpScore += 1
                this.sb.AmpCount += 1
                team.teleopScore.AllianceTeleopScore += 1
                team.teleopScore.AllianceAmpScore += 1
                team.teleopScore.AmpCount += 1
            }

            // checks if game state telop and ampState is amplified
            // if(
            //     teleop_markers[marker].markerType == "Speaker"
            //     // ampState == "Amplified"
            // ) {
            //     this.sb.SpeakerScore += 5
            //     this.sb.TeleopScore += 5
            //     this.sb.SpeakerCount += 1
            //     team.ScoreBoard.SpeakerScore += 5
            //     team.ScoreBoard.AllianceTeleopScore += 5
            //     team.ScoreBoard.SpeakerCount += 1
            // }

            // Stage Scoring
            // checks in marker type is onStage and is not Spotlit
            if (
                teleop_markers[marker].markerType == "OnStage" &&
                teleop_markers[marker].spotlitState != "Spotlit"
            ) {
                this.sb.OnStageScore += 3
                team.teleopScore.OnStageScore += 3
            }
            // checks if marker type is onStage and is spotlit
            if (
                teleop_markers[marker].markerType == "OnStage" &&
                teleop_markers[marker].spotlitState == "Spotlit"
            ) {
                this.sb.AllianceOnStageScore += 4
                team.teleopScore.AllianceOnStageScore += 4
            }
            // limits trap scoring to 15 for a max of 3 trap scores per alliance
            if (
                teleop_markers[marker].markerType == "Trap" &&
                this.sb.TrapScore < 15
            ) {
                this.sb.TrapScore += 5
                this.sb.TrapCount += 1
                team.teleopScore.AllianceTrapScore += 5
                team.teleopScore.TrapCount += 1
            }

            if (teleop_markers[marker].markerType == "Parked") {
                this.sb.ParkingScore += 1
                team.teleopScore.ParkingScore += 1
            }

            if (teleop_markers[marker].markerType == "Harmony") {
                this.sb.HarmonyScore += 2
                team.teleopScore.HarmonyScore += 2
            }
        }

        if (team.gameState["teleop"]) {
            team.gameState["teleop"].markerScore = 0
            team.gameState["teleop"].parkingScore = 0
        }

        if (team.gameState["auton"]) {
            team.gameState["auton"].markerScore = 0
            team.gameState["auton"].parkingScore = 0
        }
    }

    GetRankingPoints(color) {}

    /*  GetRankingPoints(team)
    {
        let rPoints = 0;
        // I should use a switch method but to hell with proper coding
        if(team == "blue")
        {
            if(this.sb.blueAllianceAutonScore >= 26)
            {
                rPoints++; 
            }
            if(this.sb.blueAllianceScore > this.sb.redAllianceScore)
            {
                rPoints += 2;
            }
            else if(this.sb.blueAllianceScore == this.sb.redAllianceScore)
            {
                rPoints++;
            }
        }
        if(team == "red")
        {
            if(this.sb.redAllianceAutonScore >= 26)
            {
                rPoints++; 
            }
            if(this.sb.blueAllianceScore < this.sb.redAllianceScore)
            {
                rPoints += 2;
            }
            else if(this.sb.blueAllianceScore == this.sb.redAllianceScore)
            {
                rPoints++;
            }
        }


        return rPoints;
    }*/

    // links is working :D
    // dispite the pain

    Penalty(PenType, team) {
        amount = 0
        switch (PenType) {
            case "foul":
                amount = 5
                break
            case "tech foul":
                amount = 12
                break
            case "red card":
                amount = null
                break
        }
        if (team == "blue") {
            if (amount == null) {
                this.sb.blueAllianceScore = 0
            } else {
                this.sb.redAllianceScore += amount
            }
        }
        if (team == "red") {
            if (amount == null) {
                this.sb.redAllianceScore = 0
            } else {
                this.sb.blueAllianceScore += amount
            }
        }
    }
    TeamScore(team) {
        if (team == "blue") return this.sb.AllianceScore
        if (team == "red") return this.sb.AllianceScore
        return 0
    }

    GetBoard() {
        return this.sb
    }
}

module.exports = { TileScores, ScoreLive, ScoreBoard }
