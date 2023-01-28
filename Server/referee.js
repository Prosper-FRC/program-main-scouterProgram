
function TileScores(x,y)
{
    let score = 0;
    if(y > 3)
    {
        switch(x)
        {
            case 0:
                score = 5;
            case 1:
                score = 3;
            case 2:
                score = 2;
        }
    }
    return score;
}
class ScoreAll
{
    constructor(Markers)
    {
        this.Markers = Markers; 
    }
}

module.exports = {TileScores}