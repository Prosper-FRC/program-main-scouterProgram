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
    this.AllianceScore = 0
    this.AllianceTeleopScore = 0
    this.AllianceAutonScore = 0
    this.AllianceAmpScore = 0
    this.AllianceSpeakerScore = 0
    this.AllianceTrapScore = 0
    this.AllianceMobileScore = 0
    this.AllianceOnStageScore = 0
    this.AllianceSpotlightScore = 0
    this.AllianceParkingScore = 0
    this.AllianceHarmonyScore = 0
  }
}

class ScoreLive {
  constructor() {
    this.sb = new ScoreBoard()
  }
  UpdateMarkers(auton_markers, teleop_markers, team) {
    // check the score based coords

    /** Scoring Instructions * */

    /** Scoring Instructions * */

    // 1. Loop Through Auton Markers
    // 2. Check the marker type of each marker
    // 3. Switch
    // If markerType == 'mobile'
    for (let marker in auton_markers) {
      if (auton_markers[marker].markerType == "mobile") {
        this.AllianceAutonScore += 2
        this.AllianceMobileScore += 2
      }

      // Handle Auton Scoring
      if (auton_markers[marker].markerType == "Amplifier") {
        this.AllianceAmpScore += 2
        this.AllianceAutonScore += 2
      }

      if (auton_markers[marker].markerType == "Speaker") {
        this.AllianceAutonScore += 5
        this.AllianceSpeakerScore += 5
      }
    }

    for (let marker in teleop_markers) {
      // Handle Teleop Scoring
      // checks if game state telop and ampState is not amplified
      if (
        teleop_markers[marker].markerType == "Speaker" &&
        ampState != "Amplified"
      ) {
        this.AllianceTeleopScore += 2
        this.AllianceSpeakerScore += 2
      }

      if (telop_marker[marker].marker.markerType == "Amplifier") {
        this.AllianceTeleopScore += 1
        this.AllianceAmpScore += 1
      }

      // checks if game state telop and ampState is amplified
      if (
        telop_marker[marker].marker.markerType == "Speaker" &&
        ampState == "Amplified"
      ) {
        this.AllianceSpeakerScore += 5
        this.AllianceTeleopScore += 5
      }

      // Stage Scoring
      // checks in marker type is onStage and is not Spotlit
      if (
        telop_marker[marker].marker.markerType == "OnStage" &&
        spotlitState != "Spotlit"
      ) {
        this.AllianceOnStageScore += 3
      }
      // checks if marker type is onStage and is spotlit
      if (
        telop_marker[marker].marker.markerType == "OnStage" &&
        spotlitState == "Spotlit"
      ) {
        this.AllianceOnStageScore += 4
      }
      // limits trap scoring to 15 for a max of 3 trap scores per alliance
      if (
        telop_marker[marker].marker.markerType == "Trap" &&
        this.AllianceTrapScore < 15
      ) {
        this.AllianceTrapScore += 5
      }

      if (telop_marker[marker].marker.markerType == "Parked") {
        this.AllianceParkingScore += 1
      }

      if (telop_marker[marker].marker.markerType == "Harmony") {
        this.AllianceHarmonyScore += 2
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

module.exports = { TileScores, ScoreLive }
