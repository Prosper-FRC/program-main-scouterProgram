const gp = require('./gamePieces');

function TileScores(x,y)
{
    let score = 0;
    if(y > 3)
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
    if(y > 3)
    {
        switch(x)
        {
            case 14:
                score = 2;
                break;
            case 15:
                score = 3;
                break;
            case 16:
                score = 5;
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
    UpdateMarkers(B_Markers, R_Markers, B_Markers_A, R_Markers_A)
    {
        // check the score based coords 
        
        let newAutoScoreB = 0;
        let newTeleScoreB = 0;

        let newAutoScoreR = 0;
        let newTeleScoreR = 0;
        for(const element in B_Markers)
        {
            newTeleScoreB += TileScores(B_Markers[element].x,B_Markers[element].y);
        }
        for(const element in R_Markers)
        {
            newTeleScoreR += TileScoresAlt(R_Markers[element].x,R_Markers[element].y);
        }
        for(const element in B_Markers_A)
        {
            newTeleScoreB += TileScores(B_Markers_A[element].x,B_Markers_A[element].y) + 1;
        }
        for(const element in R_Markers_A)
        {
            newTeleScoreR += TileScoresAlt(R_Markers_A[element].x,R_Markers_A[element].y) + 1;
        }
        
        this.sb.blueAllianceAutonScore = newAutoScoreB;
        this.sb.blueAllianceTelopScore = newTeleScoreB;

        this.sb.redAllianceAutonScore = newAutoScoreR;
        this.sb.redAllianceTelopScore = newTeleScoreR;


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

        this.sb.blueAllianceLinks = this.CheckLinks(BlueKeys);
        this.sb.redAllianceLinks = this.CheckLinksAlt(RedKeys);

        this.sb.blueAllianceScore = newAutoScoreB + newTeleScoreB + (this.sb.blueAllianceLinks * 5);
        this.sb.redAllianceScore = newAutoScoreR + newTeleScoreR + (this.sb.blueAllianceLinks * 5);
    }
    GetRankingPoints(team)
    {
        let rPoints = 0;
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