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
function CheckLinks()
{
    return "todo";
}

class ScoreLive
{
    CurrentScore = 0;
    Markers = {};
    constructor(Markers)
    {
        this.Markers = Markers; 
    }
    UpdateMarkers()
    {
        let newScore = 0;
        for(const element in this.Markers)
        {
            newScore += TileScores(this.Markers[element].x,this.Markers[element].y);
        }
        this.CurrentScore = newScore;
    }
    Penalty(PenType)
    {
        switch(PenType)
        {
            case "Pentype":
                break;
        }
        return "todo";
    }
    TeamScore()
    {
        return "todo";
    }
    ScoreRaw()
    {
        return this.CurrentScore;
    }

}

module.exports = {TileScores,ScoreLive}