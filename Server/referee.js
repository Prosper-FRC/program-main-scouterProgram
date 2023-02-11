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
                score = 5;
                break;
            case 15:
                score = 3;
                break;
            case 16:
                score = 2;
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
    UpdateMarkers(B_Markers, R_Markers)
    {
        let newAutoScoreB = 0;
        let newTeleScoreB = 0;

        let newAutoScoreR = 0;
        let newTeleScoreR = 0;
        for(const element in this.B_Markers)
        {
            // newAutoScoreB += TileScores(this.B_Markers[element].autonMarkers.x,this.B_Markers[element].autonMarkers.y) + 1;
            newTeleScoreB += TileScores(this.B_Markers[element].x,this.B_Markers[element].y);
        }
        for(const element in this.R_Markers)
        {
            // newAutoScoreR += TileScores(this.R_Markers[element].autonMarkers.x,this.R_Markers[element].autonMarkers.y) + 1;
            newTeleScoreR += TileScoresAlt(this.R_Markers[element].x,this.R_Markers[element].y);
        }
        
        this.sb.blueAllianceAutonScore = newAutoScoreB;
        this.sb.blueAllianceTelopScore = newTeleScoreB;

        this.sb.redAllianceAutonScore = newAutoScoreR;
        this.sb.redAllianceTelopScore = newTeleScoreR;

        this.sb.blueAllianceScore = newAutoScoreB + newTeleScoreB;
        this.sb.redAllianceScore = newAutoScoreR + newTeleScoreR;
    }
    // do not do this doesn't it work at all, its garbage 
    // TODO make it work - Sterling 
    CheckLinks()
    {
        RedXY = {}
        BlueXY = {}
        
        RedLink = 0;
        BlueLink = 0;

        for(const element in this.B_Markers)
        {
            count = 0;
            
            // BlueXY[0] = "x" + this.B_Markers[element].autonMarkers.x + "y" + this.B_Markers[element].autonMarkers.y;
            BlueXY[0] = "x" + this.B_Markers[element].x + "y"+ this.B_Markers[element].y;
            count++;
        }
        for(const element in this.R_Markers)
        {
            count = 0;
            
            // RedXY = "x" + this.R_Markers[element].autonMarkers.x + "y" + this.R_Markers[element].autonMarkers.y;
            RedXY = "x" + this.R_Markers[element].x + "y" + this.R_Markers[element].y;
            count++;
        }
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

}

module.exports = {TileScores,ScoreLive}