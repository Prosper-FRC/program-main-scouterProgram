const io = require(socket); 
const ser = require(server);
var score = 0; 

class referee
{
    function ScoreCords(x,y)
    {
        this.x = x;
        this.y = y;
        let score = 0;
        if(x == 3)
        {
            if(y < 4)
            {
                score = 4;
            }
        }

        return score;
    } 
}