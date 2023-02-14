
//Parent class of the bodies (Ball, Capsule, Box, Star, Wall)
class MarkerColor {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    equals(markerColor) {
        return (this.red == markerColor.red && this.green == markerColor.green && this.blue == markerColor.blue && this.alpha == markerColor.alpha)
    }
}

//*** GET NEW Robot to scout */
class Markers {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.markerColor;
        this.markerType; // item, parked, docked, link
        this.gameState = '';
        this.teamNumber = ''
    }
}

class Team {
    constructor(scout, teamNumber, allianceColor, markerColor) {
        this.markers = [];
        this.scout = scout;
        this.teamNumber = teamNumber;
        this.allianceColor = allianceColor;
        this.markerColor = markerColor;
        //SCOUTERS.push(this);
    }

}

class ScoreBoard {
    constructor() {
        this.redAllianceScore = 0;
        this.blueAllianceScore = 0;
        this.redAllianceLinks = 0;
        this.blueAllianceLinks = 0;
        this.redAllianceAutonScore = 0;
        this.blueAllianceAutonScore = 0;
        this.redAllianceTelopScore = 0;
        this.blueAllianceTelopScore = 0;
        this.redCoopScore = 0;
        this.blueCoopScore = 0;
    }
}

class GamePlay {
    constructor() {
        this.scoreBoard = new ScoreBoard();
        this.gameState = ""
        this.teams = [];
        this.autonMarkers = {};
        this.telopMarkers = {};
        this.preGameMarkers = {};
        this.links = [];
        this.chargingStation = {};
    }
    findTeam(scout) {
        return this.teams.find(item => item.scout === scout)
    }
    hasScouter(scout) {
        return typeof(this.findTeam(scout)) == "object"
    }
    findMarker(markerId) {
        if (markerId in this.telopMarkers) {
            return "teleop"
        } else if (markerId in this.autonMarkers) {
            return "auton"
        } else {
            return false
        }
    }
    getAutonMarker(markerId) {
        return this.autonMarkers[markerId]
    }
    getTelopMarker(markerId) {
        return this.telopMarkers[markerId]
    }
    addAutonMarker(marker, markerId) {
        this.autonMarkers[markerId] = marker
    }
    deleteAutonMarker(markerId) {
        delete this.autonMarkers[markerId]
    }
    addTelopMarker(marker, markerId) {
        this.telopMarkers[markerId] = marker
    }
    deleteTelopMarker(markerId) {
        delete this.telopMarkers[markerId]
    }
    addPreGameMarker(marker, markerId) {
        this.preGameMarkers[markerId] = marker
    }
    deletePreGameMarker(markerId) {
        delete this.preGameMarkers[markerId]
    }
    ReturnTeleOpMarkers()
    {
        return this.telopMarkers
    }
    ReturnAutonMarkers()
    {
        return this.autonMarkers
    }
    addMarker(marker, markerId) {
        if (marker.gameState == "auton") {
            this.addAutonMarker(marker, markerId)
        } else if (marker.gameState == "teleop") {
            this.addTelopMarker(marker, markerId)
        }
    }
    getMarker(markerId) {
        if (this.findMarker(markerId) == "auton") {
            return this.getAutonMarker(markerId)
        } else if (this.findMarker(markerId) == "teleop") {
            return this.getTelopMarker(markerId)
        }
    }
    deleteMarker(markerId) {
        if (this.findMarker(markerId) == "auton") {
            this.deleteAutonMarker(markerId)
        } else if (this.findMarker(markerId) == "teleop") {
            this.deleteTelopMarker(markerId)
        }
    }
    clickedChargingStation(markerId) {
        let x = markerId.substring(markerId.indexOf('x') + 1, markerId.indexOf('y'))
        let y = markerId.substring(markerId.indexOf('y') + 1, markerId.length)
        if (
            x >= this.chargingStation.x && 
            x < (this.chargingStation.x + this.chargingStation.width) && 
            y >= this.chargingStation.y && 
            y < (this.chargingStation.y + this.chargingStation.height)
        ) {
            return true
        } else {
            return false
        }
    }
    
}

class ChargingStation {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.docked = false
        this.engaged = false
    }
}


module.exports = {MarkerColor, Team, Markers, GamePlay, ScoreBoard, ChargingStation}