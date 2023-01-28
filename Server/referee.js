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
    console.log(score);
    return score;
}
function CheckLinks()
{
    
}

class ScoreLive
{
    CurrentScore = 0;
    Markers = [];
    constructor(Markers)
    {
        this.Markers = Markers; 
    }
    UpdateMarkers(Markers)
    {
        this.Markers = Markers;
    }
    Penalty(PenType)
    {
        switch(PenType)
        {
            case ("Foul"):
            
        }
    }
    ScoreRaw()
    {
        
    }

}

module.exports = {TileScores}