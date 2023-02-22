
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
        //this.markers = [];
        this.scout = scout;
        this.teamNumber = teamNumber;
        this.allianceColor = allianceColor;
        this.markerColor = markerColor;
        this.gameState = [];
        this.connection = false
        //SCOUTERS.push(this);
    }

}

class GameState {
    constructor() {
        this.markerScore = 0;
        this.parkingScore = 0;
        this.parkingState = '';

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
        this.parkingField = {};
        this.itemField = {};
    }

    gameStateIndicator() {
        switch (this.gameState) {
            case "pregame":
                return 1
            case "auton": 
                return 0.7
            case "teleop":
                return 0.3
        }
    }

    /*switchGameState(gameValue) {
        switch(gameValue) {
            case "0":
               this.gameState = "pregame"
                break
            case "1":
                this.gameState = "auton"
                break
            case "2":
                this.gameState = "teleop"
                break
            default:
                this.gameState = "pregame" 
        }
    }*/

    switchGameState(gameStates, gameValue) {
        let index = Number(gameValue)
        this.gameState = gameStates[index]
    }

    addTeam(team) {
        this.teams.push(new Team(team.scout, team.teamNumber, team.allianceColor, new MarkerColor(team.markerColor.red, team.markerColor.green, team.markerColor.blue, team.markerColor.alpha)))
    }

    findTeam(scout) {
        return this.teams.find(item => item.scout === scout)
    }

    hasScouter(scout) {
        return typeof(this.findTeam(scout)) == "object"
    }

    findMarker(markerId) {
        if (markerId in this.preGameMarkers) {
            return "pregame"
        } else if (markerId in this.telopMarkers) {
            return "teleop"
        } else if (markerId in this.autonMarkers) {
            return "auton"
        }
        return false
    }

    getPregameMarker(markerId) {
        return this.preGameMarkers[markerId]
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
        switch (marker.gameState) {
            case "pregame":
                this.addPreGameMarker(marker, markerId)
                break
            case "auton":
                this.addAutonMarker(marker, markerId)
                break
            case "teleop":
                this.addTelopMarker(marker, markerId)
                break
        }
    }

    getMarker(markerId) {
        switch(this.findMarker(markerId)) {
            case "pregame":
                return this.getPregameMarker(markerId)
            case "auton":
                return this.getAutonMarker(markerId)
            case "teleop":
                return this.getTelopMarker(markerId)
        }
    }

    deleteMarker(markerId) {
        switch (this.findMarker(markerId)) {
            case "pregame": 
                this.deletePreGameMarker(markerId)
                break
            case "auton":
                this.deleteAutonMarker(markerId)
                break
            case "teleop":
                this.deleteTelopMarker(markerId)
                break
        }
    }
    clickedItemField(markerId) {
        let x = markerId.substring(markerId.indexOf('x') + 1, markerId.indexOf('y'))
        let y = markerId.substring(markerId.indexOf('y') + 1, markerId.length)
        if (
            x >= this.itemField.x && 
            x < (this.itemField.x + this.itemField.width) && 
            y >= this.itemField.y && 
            y < (this.itemField.y + this.itemField.height)
        ) {
            return true
        } else {
            return false
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

    clickedParkingField(markerId) {
        let x = markerId.substring(markerId.indexOf('x') + 1, markerId.indexOf('y'))
        let y = markerId.substring(markerId.indexOf('y') + 1, markerId.length)
        if (
            x >= this.parkingField.rectOne_x && 
            x < (this.parkingField.rectOne_x + this.parkingField.rectOne_width) && 
            y >= this.parkingField.rectOne_y && 
            y < (this.parkingField.rectOne_y + this.parkingField.rectOne_height)
        ) {
            return true
        } 
        else if (x >= this.parkingField.rectTwo_x && 
            x < (this.parkingField.rectTwo_x + this.parkingField.rectTwo_width) && 
            y >= this.parkingField.rectTwo_y && 
            y < (this.parkingField.rectTwo_y + this.parkingField.rectTwo_height)) 
        {
            return true
        }
        else {
            return false
        }
    }

    GetMarkerType(markerId, currState, gameState)
    {
        if(this.clickedChargingStation(markerId) == true && currState == 'Docked')
        {
            return 'Engaged'
        }
        else if(this.clickedChargingStation(markerId) == true)
        {
            return 'Docked'
        }
        else if (gameState == 'auton' && !(this.clickedParkingField(markerId)) && !(this.clickedChargingStation(markerId))
                 && !(this.clickedItemField(markerId)))
        {
            return 'AutonParked'
        }
        else if(this.clickedParkingField(markerId) == true)
        {
            return 'Parked'
        }

    
        return 'Item'
       
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

class Match {
    constructor() {
        this.matchNumber = ''
        this.scoreboard = {}
        this.gamePlay = {
            blue: {},
            red: {}
        }
    }
}

class ParkingField {
    constructor(rectOne_x, rectOne_y, rectOne_width, rectOne_height, rectTwo_x, rectTwo_y, rectTwo_width, rectTwo_height){
        this.rectOne_x = rectOne_x;
        this.rectOne_y = rectOne_y;
        this.rectOne_width = rectOne_width;
        this.rectOne_height = rectOne_height;
        this.rectTwo_x = rectTwo_x;
        this.rectTwo_y = rectTwo_y;
        this.rectTwo_width = rectTwo_width;
        this.rectTwo_height = rectTwo_height;
    }
}

class ItemField {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}
    


module.exports = {MarkerColor, Team, Markers, GamePlay, ScoreBoard, ChargingStation, Match, ParkingField, GameState, ItemField}