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
function AutonTileScores(x,y)
{
    let score = 0;
    if(y >= 3)
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
function AutonTileScoresAlt(x,y)
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
    }
    UpdateMarkers(B_Markers, R_Markers, B_Markers_A, R_Markers_A, team)
    {
        // check the score based coords 
        // im not quite sure if I should leave athe code like this and store the markers in the class
        // however I hate JS so that ain't happening  
        let newAutoScoreB = 0;
        let newTeleScoreB = 0;

        let newAutoScoreR = 0;
        let newTeleScoreR = 0;

      /*  let newAutoParkingB = 0;
        let newAutoParkingR = 0;
        let newTeleParkingB = 0;
        let newTeleParkingR = 0;*/

        team.autonMarkerScore = 0;
        team.telopMarkerScore = 0;
        for(const element in B_Markers)
        {
            
           
            if(B_Markers[element].markerType == 'Item')
            {
                newTeleScoreB += TileScores(B_Markers[element].x,B_Markers[element].y);
                if(B_Markers[element].teamNumber === team.teamNumber)
                {
                    team.telopMarkerScore += TileScores(B_Markers[element].x,B_Markers[element].y);
                }
                                
            }
            else if (B_Markers[element].markerType == 'Parked')
            {
                newTeleScoreB += 2;
                if(B_Markers[element].teamNumber === team.teamNumber)
                {
                    team.telopParkingScore = 2;
                }
            }

        }
        for(const element in R_Markers)
        {
            
            if(R_Markers[element].markerType == 'Item')
            {
                newTeleScoreR += TileScoresAlt(R_Markers[element].x,R_Markers[element].y);
                if(R_Markers[element].teamNumber === team.teamNumber)
                {
                    team.telopMarkerScore += TileScoresAlt(R_Markers[element].x,R_Markers[element].y);
                }
            }
            else if (R_Markers[element].markerType == 'Parked')
            {
                newTeleScoreR += 2;
                if(R_Markers[element].teamNumber === team.teamNumber)
                {
                    team.telopParkingScore = 2;
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
                    if(B_Markers_A[element].teamNumber === team.teamNumber)
                    {
                        team.autonMarkerScore += TileScores(B_Markers_A[element].x,B_Markers_A[element].y) + 1;
                    }
                }
            }
            else if (B_Markers_A[element].markerType == 'Parked')
            {
                newAutoScoreB += TileScores(B_Markers_A[element].x,B_Markers_A[element].y) + 1;
                
            }
        }
        for(const element in R_Markers_A)
        {
            //if (R_Markers_A[element].)
            if(TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) != 0)
            {
                newAutoScoreR += TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) + 1;
               // console.log("AutonMarkerScoreRed: " + newAutoScoreR);
                if(R_Markers_A[element].teamNumber === team.teamNumber)
                {
                    team.autonMarkerScore += TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) + 1;
                }
            }
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

        this.sb.blueAllianceScore = newAutoScoreB + newTeleScoreB + (this.sb.blueAllianceLinks * 5);
        this.sb.redAllianceScore = newAutoScoreR + newTeleScoreR + (this.sb.redAllianceLinks * 5);
    }
    GetRankingPoints(team)
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
    }
    
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