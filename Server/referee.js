const gp = require('./gamePieces');

function TileScores(x,y)
{
    let score = 0;
    if(y >= 3)
    {
        switch(x)
        {
            case 0:
                score = 5;
                break;
            case 1:
                score = 3;
                break;
            case 2:
                score = 2;
                break;
            default:
                score = 0;
                break;
        }
    }
    
    return score;
}
function TileScoresAlt(x,y)
{
    let score = 0;
    if(y >= 3)
    {
        switch(x)
        {
            case 11:
                score = 2;
                break;
            case 12:
                score = 3;
                break;
            case 13:
                score = 5;
                break;
            default:
                score = 0;
                break;
        }
    }
    
    return score;
}
function CoopScores(x,y)
{
    let score = 0;
    if(y > 5 && y < 9)
    {
        switch(x)
        {
            case 0:
                score = 6;
                break;
            case 1:
                score = 4;
                break;
            case 2:
                score = 3;
                break;
            default:
                score = 0;
                break;
        }
    }
    
    return score;
}
function CoopScoresAlt(x,y)
{
    let score = 0;
    if(y >= 3)
    {
        switch(x)
        {
            case 12:
                score = 3;
                break;
            case 13:
                score = 4;
                break;
            case 14:
                score = 6;
                break;
            default:
                score = 0;
                break;
        }
    }
    
    return score;
}





class ScoreLive
{
    sb = new gp.ScoreBoard();
    constructor()
    {
        this.sb.redAllianceScore = 0;
        this.sb.blueAllianceScore = 0;
        this.sb.redAllianceLinks = 0;
        this.sb.blueAllianceLinks = 0;
        this.sb.redAllianceAutonScore = 0;
        this.sb.blueAllianceAutonScore = 0;
        this.sb.redAllianceTelopScore = 0;
        this.sb.blueAllianceTelopScore = 0;
        this.sb.redCoopScore = 0;
        this.sb.blueCoopScore = 0;
        this.sb.blueChargingScore = 0;
        this.sb.redChargingScore = 0;
        this.sb.blueRankingPoints = 0;
        this.sb.redRankingPoints = 0;
    }
    UpdateMarkers(B_Markers, R_Markers, B_Markers_A, R_Markers_A, teamNumber, team)
    {
        // check the score based coords 
        // im not quite sure if I should leave athe code like this and store the markers in the class
        // however I hate JS so that ain't happening  
        let newAutoScoreB = 0;
        let newTeleScoreB = 0;

        let newAutoScoreR = 0;
        let newTeleScoreR = 0;

        let newCoopScoreB = 0;
        let newCoopScoreR = 0;

        let newChargingScoreR = 0;
        let newChargingScoreB = 0;

      /*  let newAutoParkingB = 0;
        let newAutoParkingR = 0;
        let newTeleParkingB = 0;
        let newTeleParkingR = 0;*/
        
        if(team.gameState['teleop'])
        {
            team.gameState['teleop'].markerScore = 0;
            team.gameState['teleop'].parkingScore = 0;
        }

        if(team.gameState['auton'])
        {
            team.gameState['auton'].markerScore = 0;
            team.gameState['auton'].parkingScore = 0;
        }

        for(const element in B_Markers)
        {
            
           
            if(B_Markers[element].markerType == 'Item')
            {
                newTeleScoreB += TileScores(B_Markers[element].x,B_Markers[element].y);
                B_Markers[element].score = TileScores(B_Markers[element].x,B_Markers[element].y);
                if(B_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].markerScore += TileScores(B_Markers[element].x,B_Markers[element].y);
                }
                if(B_Markers[element].x < 4 && B_Markers[element].y > 5 && B_Markers[element].y < 9 )
                    newCoopScoreB++;  
            }
            else if (B_Markers[element].markerType == 'Parked')
            {
                newTeleScoreB += 2;
                B_Markers[element].score = 2;
                if(B_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].parkingScore = 2;
                    team.gameState['teleop'].parkingState = 'Parked';
                }
            }
            else if (B_Markers[element].markerType == 'Docked')
            {
                newTeleScoreB += 6;
                newChargingScoreB += 6;
                B_Markers[element].score = 6;
                if(B_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].parkingScore = 6;
                    team.gameState['teleop'].parkingState = 'Docked';
                }
            }
            else if (B_Markers[element].markerType == 'Engaged')
            {
                newTeleScoreB += 10;
                newChargingScoreB += 10;
                B_Markers[element].score = 10;
                if(B_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].parkingScore = 10;
                    team.gameState['teleop'].parkingState = 'Engaged';
                }
            }

        }
        for(const element in R_Markers)
        {
            
            if(R_Markers[element].markerType == 'Item')
            {
                newTeleScoreR += TileScoresAlt(R_Markers[element].x,R_Markers[element].y);
                R_Markers[element].score = TileScoresAlt(R_Markers[element].x,R_Markers[element].y);
                if(R_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].markerScore += TileScoresAlt(R_Markers[element].x,R_Markers[element].y);
                }
                if(R_Markers[element].x > 10 && R_Markers[element].y > 5 && R_Markers[element].y < 9 )
                        newCoopScoreR++; 
            }
            else if (R_Markers[element].markerType == 'Parked')
            {
                newTeleScoreR += 2;
                R_Markers[element].score = 2;
                if(R_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].parkingScore = 2;
                    team.gameState['teleop'].parkingState = 'Parked';
                }
            }
            else if (R_Markers[element].markerType == 'Docked')
            {
                newTeleScoreR += 6;
                newChargingScoreR += 6;
                R_Markers[element].score = 6;
                if(R_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].parkingScore = 6;
                    team.gameState['teleop'].parkingState = 'Docked';
                }
            }
            else if (R_Markers[element].markerType == 'Engaged')
            {
                newTeleScoreR += 10;
                newChargingScoreR += 10;
                R_Markers[element].score = 10;
                if(R_Markers[element].teamNumber === teamNumber)
                {
                    team.gameState['teleop'].parkingScore = 10;
                    team.gameState['teleop'].parkingState = 'Engaged';
                }
            }
        }
        for(const element in B_Markers_A)
        {
            if(B_Markers_A[element].markerType == 'Item')
            {
                if(TileScores(B_Markers_A[element].x,B_Markers_A[element].y) != 0)
                {
                    newAutoScoreB += TileScores(B_Markers_A[element].x,B_Markers_A[element].y) + 1;
                    B_Markers_A[element].score = TileScores(B_Markers_A[element].x,B_Markers_A[element].y) + 1;
                    if(B_Markers_A[element].teamNumber === teamNumber)
                    {
                        team.gameState['auton'].markerScore += TileScores(B_Markers_A[element].x,B_Markers_A[element].y) + 1;
                    }
                    if(B_Markers_A[element].x < 4 && B_Markers_A[element].y > 5 && B_Markers_A[element].y < 9 )
                        newCoopScoreB++; 
                }
            }
            else if (B_Markers_A[element].markerType == 'AutonParked')
            {
                newAutoScoreB += 3;
                B_Markers_A[element].score = 3;
                if(B_Markers_A[element].teamNumber === teamNumber)
                {
                    team.gameState['auton'].parkingScore = 3;
                    team.gameState['auton'].parkingState = 'Parked';
                }
                
            }
            else if (B_Markers_A[element].markerType == 'Docked')
            {
                newAutoScoreB += 8;
                newChargingScoreB += 8;
                B_Markers_A[element].score = 8;
                if(B_Markers_A[element].teamNumber === teamNumber)
                {
                    team.gameState['auton'].parkingScore = 8;
                    team.gameState['auton'].parkingState = 'Docked';
                }
                
            }
            else if (B_Markers_A[element].markerType == 'Engaged')
            {
                newAutoScoreB += 12;
                newChargingScoreB += 12;
                B_Markers_A[element].score = 12;
                if(B_Markers_A[element].teamNumber === teamNumber)
                {
                    team.gameState['auton'].parkingScore = 12;
                    team.gameState['auton'].parkingState = 'Engaged';
                }
                
            }
        }
        for(const element in R_Markers_A)
        {
            if(R_Markers_A[element].markerType == 'Item')
            {
                if(TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) != 0)
                {
                    newAutoScoreR += TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) + 1;
                    R_Markers_A[element].score = TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) + 1;
                    if(R_Markers_A[element].teamNumber === teamNumber)
                    {
                        team.gameState['auton'].markerScore += TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) + 1;
                    }
                    if(R_Markers_A[element].x > 10 && R_Markers_A[element].y > 5 && R_Markers_A[element].y < 9 )
                        newCoopScoreR++; 
                }
            }
            else if (R_Markers_A[element].markerType == 'AutonParked')
            {
                newAutoScoreR += 3;
                R_Markers_A[element].score = 3;
                if(R_Markers_A[element].teamNumber === teamNumber)
                {
                    team.gameState['auton'].parkingScore = 3;
                    team.gameState['auton'].parkingState = 'Parked';
                }
                
            }
            else if (R_Markers_A[element].markerType == 'Docked')
            {
                newAutoScoreR += 8;
                newChargingScoreR += 8;
                R_Markers_A[element].score = 8;
                if(R_Markers_A[element].teamNumber === teamNumber)
                {
                    team.gameState['auton'].parkingScore = 8;
                    team.gameState['auton'].parkingState = 'Docked';
                }
                
            }
            else if (R_Markers_A[element].markerType == 'Engaged')
            {
                newAutoScoreR += 12;
                newChargingScoreR += 12;
                R_Markers_A[element].score = 12;
                if(R_Markers_A[element].teamNumber === teamNumber)
                {
                    team.gameState['auton'].parkingScore = 12;
                    team.gameState['auton'].parkingState = 'Engaged';
                }
                
            }
            //if (R_Markers_A[element].)
            
        }

        // add link checking here 
        let BlueKeys = [];
        for(const element in B_Markers)
        {
            BlueKeys.push(element);
        }
        for(const element in B_Markers_A)
        {
            BlueKeys.push(element);
        }

        let RedKeys = [];
        for(const element in R_Markers)
        {
            RedKeys.push(element);
        }
        for(const element in R_Markers_A)
        {
            RedKeys.push(element);
        }

       
        this.sb.blueAllianceAutonScore = newAutoScoreB;
        this.sb.blueAllianceTelopScore = newTeleScoreB;

        this.sb.redAllianceAutonScore = newAutoScoreR;
        this.sb.redAllianceTelopScore = newTeleScoreR;

        this.sb.blueAllianceLinks = this.CheckLinks(BlueKeys);
        this.sb.redAllianceLinks = this.CheckLinksAlt(RedKeys);

        this.sb.blueAllianceScore = newAutoScoreB + newTeleScoreB;// + (this.sb.blueAllianceLinks * 5);
        this.sb.redAllianceScore = newAutoScoreR + newTeleScoreR;// + (this.sb.redAllianceLinks * 5);

        this.sb.blueCoopScore = newCoopScoreB;
        this.sb.redCoopScore = newCoopScoreR;

        this.sb.blueChargingScore = newChargingScoreB;
        this.sb.redChargingScore = newChargingScoreR;

        this.sb.blueRankingPoints = this.GetRankingPoints('blue');
        this.sb.redRankingPoints = this.GetRankingPoints('red');

    }

    GetRankingPoints(color)
    {
        let newRankingPoint = 0

        if (this.sb.blueAllianceScore == this.sb.redAllianceScore)
                newRankingPoint++;
        if (color == 'blue')
        {
            if (this.sb.blueAllianceScore > this.sb.redAllianceScore)
                newRankingPoint += 2;
            if (this.sb.blueAllianceLinks >= 5 || (this.sb.blueAllianceLinks == 4 && (this.sb.blueCoopScore >= 3 && this.sb.redCoopScore >= 3)))
                newRankingPoint++;
            if (this.sb.blueChargingScore >= 26)
                newRankingPoint++;
            
        }
        else
        {
            if (this.sb.redAllianceScore > this.sb.blueAllianceScore)
                newRankingPoint += 2;
            if (this.sb.redAllianceLinks >= 5 || (this.sb.redAllianceLinks == 4 && (this.sb.blueCoopScore >= 3 && this.sb.redCoopScore >= 3)))
                newRankingPoint++;
            if (this.sb.redChargingScore >= 26)
                newRankingPoint++;
        }

        return newRankingPoint;
    }
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

    CheckLinks(LinkKeys)
    {
        let NumOfLinks = 0; 
        let Whitelist = []
        for(let n = 0; n <= 2; n++)
        {
            let CurrentLinks = LinkKeys.filter( word => word.indexOf(String("x" + n)) != -1 ) 
            for(const s in CurrentLinks)
            {
                let str = CurrentLinks[s];
                let yNum = Number(str.substring(str.indexOf("y") + 1));
                if((Whitelist.indexOf(String("x"+n+"y"+(yNum - 1))) == -1) && (Whitelist.indexOf(String("x"+n+"y"+(yNum + 1))) == -1) && (Whitelist.indexOf(String("x"+n+"y"+(yNum))) == -1))
                {    
                    if( ( CurrentLinks.indexOf(String("x"+n+"y"+(yNum - 1) ) ) != -1) && (CurrentLinks.indexOf(String("x"+n+"y"+(yNum + 1))) != -1 ) )
                    {
                        NumOfLinks++;
                        Whitelist.push((String("x"+n+"y"+(yNum - 1))));
                        Whitelist.push((String("x"+n+"y"+(yNum))));
                        Whitelist.push((String("x"+n+"y"+(yNum + 1))));
                    }
                }
            }
            
        }
        return NumOfLinks;
    }
        
    
    CheckLinksAlt(LinkKeys)
    {
        let NumOfLinks = 0; 
        let Whitelist = []
        for(let n = 14; n <= 16; n++)
        {
            let CurrentLinks = LinkKeys.filter( word => word.indexOf(String("x" + n)) != -1 ) 
            for(const s in CurrentLinks)
            {
                let str = CurrentLinks[s];
                let yNum = Number(str.substring(str.indexOf("y") + 1));
                if((Whitelist.indexOf(String("x"+n+"y"+(yNum - 1))) == -1) && (Whitelist.indexOf(String("x"+n+"y"+(yNum + 1))) == -1) && (Whitelist.indexOf(String("x"+n+"y"+(yNum))) == -1))
                {    
                    if( ( CurrentLinks.indexOf(String("x"+n+"y"+(yNum - 1) ) ) != -1) && (CurrentLinks.indexOf(String("x"+n+"y"+(yNum + 1))) != -1 ) )
                    {
                        NumOfLinks++;
                        Whitelist.push((String("x"+n+"y"+(yNum - 1))));
                        Whitelist.push((String("x"+n+"y"+(yNum))));
                        Whitelist.push((String("x"+n+"y"+(yNum + 1))));
                    }
                }
            }
            
        }
        return NumOfLinks;
    }


    Penalty(PenType, team)
    {
        amount = 0;
        switch(PenType)
        {
            case "foul":
                amount = 5;
                break;
            case "tech foul": 
                amount = 12;
                break
            case "red card": 
                amount = null;
                break;
        }
        if(team == "blue")
        {
            if(amount == null)
            {
                this.sb.blueAllianceScore = 0;
            }
            else 
            {
                this.sb.redAllianceScore += amount;
            }
        }
        if(team == "red")
        {
            if(amount == null)
            {
                this.sb.redAllianceScore = 0;
            }
            else 
            {
                this.sb.blueAllianceScore += amount;
            }
        }
    }
    TeamScore(team)
    {
        if(team == "blue")
            return this.sb.blueAllianceScore;
        if(team == "red")
            return this.sb.redAllianceScore;
        return 0;
    }
    GetLinks(team)
    {
        if(team == "blue")
            return this.sb.blueAllianceLinks;
        if(team == "red")
            return this.sb.redAllianceLinks;
        return 0;
    }
    GetBoard()
    {
        return this.sb;
    }


}

module.exports = {TileScores,ScoreLive}