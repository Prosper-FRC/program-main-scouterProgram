class Field 
{
    constructor(bg, width, height)
    {
        this.bg = bg
        this.width = width
        this.height = height
        this.rotation = "0deg"
        this.flipped = false
    } 

    isFlipped() 
    {
        return this.flipped
    }

    flip()
    {
        this.flipped = !this.isFlipped()
    }

    rotate(rotation)
    {
        this.rotation = rotation
    }

    getRotation()
    {
        return "rotate(" + this.rotation + ")"
    }

    getDimensions()
    {
        return {
            bg: this.bg,
            width: this.width,
            height: this.height
        }
    }
}

class Grid 
{
    constructor(width, height, boxWidth, boxHeight)
    {
        this.width = width
        this.height = height
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
    }

    getDimensions()
    {
        return {
            width: this.width,
            height: this.height,
            boxWidth: this.boxWidth,
            boxHeight: this.boxHeight
        }
    }
}

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

class Markers {
    constructor(x, y) 
    {
        this.x = x;
        this.y = y;
        this.markerColor;
        this.markerType; // item, parked, docked, link, mobile
        this.gameState = '';
        this.teamNumber = ''
        this.timestamp = ''
        this.score = 0;
    }

    setCoordinates(x, y)
    {
        this.x = x
        this.y = y
    }

    getCoordinates()
    {
        return "x" + this.x + "y" + this.y
    }

    createTimeStamp(startTime) 
    {
        this.timestamp = (performance.now() / 1000) - startTime
    }

    deleteTimeStamp() 
    {
        this.timestamp = ''
    }
}

class Scouter 
{
    constructor(name, markerColor)
    {
        this.name = name
        this.markerColor = markerColor
    }
}

class Roster
{
    constructor(blue, red, admin)
    {
        this.blue = blue
        this.red = red
        this.admin = admin
    }
}

/*class TimeSheet
{
    constructor()
}*/

class TimeTable
{
    constructor(blueSchedule, redSchedule)
    {
        this.matchNumber = 1
        this.schedule = {
            "blue": blueSchedule,
            "red": redSchedule
        }
    }

    setMatch(matchNumber)
    {
        this.matchNumber = matchNumber
    }

    getSchedule(color)
    {
        return this.schedule[color]
    }

    getLineUp(color, matchNumber)
    {
        return this.schedule[color][matchNumber]
    }

    getCurrentLineUp(color)
    {
        return this.schedule[color][this.matchNumber]
    }

    hasScouter(scout)
    {
        return this.schedule.blue[this.matchNumber].includes(scout) || this.schedule.red[this.matchNumber].includes(scout)
    }
}

class Event {
    constructor(matches) {
        this.matches = matches
        this.schedule = {}
    }

    createSchedule(roster) {
        let alternate = ""
        for (let match = 1; match <= this.matches; match++) 
        {
            if ((match - 1) % (roster.length - 1) == 0)
            {
                alternate = roster.shift()
                roster.push(alternate)
            }           
            this.schedule[match] = [roster[0], roster[1], roster[2]]
        }
    }

    substitute(scout, sub, duration) {
        for (let match = 1; match <= duration; match++) 
        {
            let index = schedule[match].indexOf(scout)
            if (index >= 0) 
            {
              this.schedule[match].splice(index, 1)
              this.schedule[match].splice(index, 0, sub)
            }
        }
    }

    getMatchLineup(match) {
        return this.schedule[match]
    }

    hasScouter(match, scout) {
        return this.schedule[match].includes(scout)
    }
}

class Team {
    constructor(scout, teamNumber, allianceColor, markerColor) 
    {
        this.scout = scout;
        this.teamNumber = teamNumber;
        this.idx = 0;
        this.allianceColor = allianceColor;
        this.markerColor = markerColor;
        this.gameState = [];
        this.teleopScore = {};
        this.autonScore = {};
        this.connection = false
        this.docked = false
        this.mobile = false
        this.engaged = false
    }

    connect() {
        this.connection = true
    }

    disconnect() {
        this.connection = false
    }

    isConnected() {
        return this.connection
    }

    hasTeamNumber() {
        return this.teamNumber != ''
    }

    reset() {
        this.teamNumber = ''
    }

    dock() {
        this.docked = true
    }


    undock() {
        this.docked = false
    }

    engage() {
        this.engaged = true
    }

    disengage() {
        this.engaged = false
    }

}

class GameState {
    constructor() {
        this.markerScore = 0;
        this.parkingScore = 0;
        this.parkingState = '';

    }

    park() {}

    unpark() {
        this.parkingState = ''
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

//clean up
class GamePlay {

    constructor() {
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

    clearGameStates() {
        for (let team of this.teams) {
            team.gameState = []    
        }
    }

    getScouterCount() {
        let scouterCount = 0
        for (let team of this.teams) {
            if (team.isConnected()) {
                scouterCount++
            }
        }
        return scouterCount
    }

    isFull() {
        return this.getScouterCount() >= 3
    }

    gameStateIndicator() {
        switch (this.gameState) {
            case "pregame":
                return 1
            case "auton": 
                return 0.8
            case "teleop":
                return 0.5
        }
    }

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

    hasConnectedScouter(scout) {
        if (this.hasScouter(scout)) {
            return this.findTeam(scout).isConnected()
        }
        return false
    }

    getScouters() {
        let scouters = []
        for (let team of this.teams) 
        {
            if (team.scout != "admin") 
            {
                scouters.push(team.scout)
            }
        }
        return scouters
    }

    resetTeams() {
        for (let team of this.teams) {
            team.teamNumber = ''
        }
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

    deleteMarkers() {
        this.preGameMarkers = {}
        this.autonMarkers = {}
        this.telopMarkers = {}
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
        return !!(x >= this.itemField.x && 
            x < (this.itemField.x + this.itemField.width) && 
            y >= this.itemField.y && 
            y < (this.itemField.y + this.itemField.height))
    }

    dockAll() {
        for (let team of this.teams) {
            team.dock()
        }
    }

    engageAll() {
        for (let team of this.teams) {
            team.engage()
        }
    }

    undockAll() {
        for (let team of this.teams) {
            team.undock()
        }
    }

    disengageAll() {
        for (let team of this.teams) {
            team.disengage()
        }
    }

    clickedChargingStation(markerId) {
        let x = markerId.substring(markerId.indexOf('x')+1, markerId.indexOf('y'))
        let y = markerId.substring(markerId.indexOf('y')+1, markerId.length)
        return !!(x >= this.chargingStation.x && 
            x < (this.chargingStation.x + this.chargingStation.width) && 
            y >= this.chargingStation.y && 
            y < (this.chargingStation.y + this.chargingStation.height))
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
            return 'Mobile'
        }
        else if (gameState == 'teleop' && !(this.clickedParkingField(markerId)) && !(this.clickedChargingStation(markerId))
                 && !(this.clickedItemField(markerId)))
        {
            return 'OutOfBounds'
        }
        else if(this.clickedParkingField(markerId) == true)
        {
            return 'Parked'
        }

    
        return 'Item'
       
    }

    unparkAll() {}
    
}

class ChargingStation {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.docked = 0
        this.engaged = 0
        this.level = false
    }

    engage() {
        this.engaged++
        this.level = (this.engaged == this.docked)
    }

    dock() {
        this.docked++
        this.level = (this.engaged == this.docked)
    }


    disengage() {
        this.engaged--
        this.level = (this.engaged == this.docked)
    }

    undock() {
        this.docked--
        this.level = (this.engaged == this.docked)
    }

    reset() {
        this.engaged = 0
        this.docked = 0
        this.level = false
    }
}

class Match {
    constructor() {
        this.matchNumber = '1'
        this.session = false
        this.startTime = ''
        this.autonStartTime = ''
        this.scoreboard = {}
        this.gamePlay = {
            blue: {},
            red: {}
        }
        this.admin = false
    }

    open() {
        this.session = true
    }

    start() {
        this.startTime = (performance.now() / 1000)
    }

    autonStart() {
        this.autonStartTime = (performance.now() / 1000)
    }

    inSession() {
        return this.session
    }
    
    reset() {
        this.session = false
        this.startTime = ''
    }

    connectAdmin() {
        this.admin = true
    }

    disconnectAdmin() {
        this.admin = false
    }

    hasScouter(scoutName) {
        return (this.gamePlay.blue.hasScouter(scoutName) || this.gamePlay.red.hasScouter(scoutName))
    }

    hasConnectedScouter(scoutName) {
        return (this.gamePlay.blue.hasConnectedScouter(scoutName) || this.gamePlay.red.hasConnectedScouter(scoutName))
    }

    hasAdmin() {
        return this.admin
    }

    getGamePlay(color) {
        return this.gamePlay[color]
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

module.exports = {Field, Grid, MarkerColor, Team, Markers, GamePlay, ScoreBoard, ChargingStation, Match, ParkingField, GameState, ItemField, Event, TimeTable}