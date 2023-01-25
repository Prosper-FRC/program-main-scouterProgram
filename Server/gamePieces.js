
//Parent class of the bodies (Ball, Capsule, Box, Star, Wall)
class MarkerColor {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

//*** GET NEW Robot to scout */
class Markers{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.markerColor;
        this.isSelected = false;
        this.gameState = '';
    }
}


class Scout{
    constructor(name, team, allianceColor, markerColor){
        this.markers = [];
        this.name = name;
        this.team = team;
        this.allianceColor = allianceColor;
        this.markerColor = markerColor;
        //SCOUTERS.push(this);
    }

}


module.exports = {MarkerColor,Scout,Markers}