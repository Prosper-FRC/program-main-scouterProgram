const ref = require('./referee') 
const { performance } = require("perf_hooks")


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

class MarkerColor 
{
    constructor(red, green, blue, alpha) 
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    equals(markerColor) 
    {
        return (this.red == markerColor.red && this.green == markerColor.green && this.blue == markerColor.blue && this.alpha == markerColor.alpha)
    }
}

class Markers 
{
    constructor(x, y) 
    {
        this.x = x;
        this.y = y;
        this.markerColor; // this color of the marke, unused
        this.markerLocationType; // specifies the location that was clicked to render the shape
        this.markerRotation; //specifies how much to rotate to draw the rectangle
        this.markerLocationCoordinates; //specifies the [x,y] coordinates to place the shape
        this.markerType; // item, parked, docked, link, mobile
        this.isMarkedOnce = "false";
        this.isSingleSpace = "false";
        this.gameState = '';
        this.ampState = '';
        this.spotlitState = '';
        this.teamNumber = ''
        this.timestamp = ''
        this.score = 0;
    }

    // Getters

    // if there are multiple coordinates representing the location space use markerLocationType as the id instead of the coordinates
    getCoordinates()
    {
        if (this.isSingleSpace == "true")
            return this.markerLocationType;
        return "x" + this.x + "y" + this.y
    }

    getMarkerType()
    {
        return this.markerType
    }

    getGameState()
    {
        return this.gameState
    }

    getX()
    {
        return this.x;
    }

    getY()
    {
        return this.y;
    }

    // Setters

    setMarkerColor(red, green, blue, alpha)
    {
        this.markerColor = new MarkerColor(red, green, blue, alpha)
    }   

    setCoordinates(x, y)
    {
        this.x = x
        this.y = y
    }

    setType(markerType)
    {
        this.markerType = markerType
    }

    setGameState(gameState)
    {
        this.gameState = gameState
    }

    isItem()
    {
        return this.markerType == 'Item'
    }

    isParked()
    {
        return this.markerType == 'Parked'
    }

    isMobile()
    {
        return this.markerType == 'Mobility'
    }

    isOutOfBounds()
    {
        return this.markerType == 'OutOfBounds'
    }

    setTeamNumber(teamNumber)
    {
        this.teamNumber = teamNumber
    }

    getTeamNumber()
    {
        return this.teamNumber
    }

    hasTeamNumber(teamNumber)
    {
        return this.teamNumber == teamNumber
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

class User
{
    constructor(name, password)
    {
        this.name = name
        this.password = password
    }

    isBlank()
    {
        return this.name == ""
    }

    hasName(name) 
    {
        return this.name == name
    }

    hasPassword(password)
    {
        return this.password == password
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

class Event
{
    constructor(schedule)
    {
        this.matchNumber = 1
        this.schedule = {
            "blue": {},
            "red": {}
        }
        
        let blue = {}
        let red = {}

        for (let match in schedule)
        {
            if  (schedule[match] != null) // skip the null object
            {
            blue[match] = schedule[match]["blue"]
            red[match] = schedule[match]["red"]
            }
        }

        this.schedule.blue = new TimeTable(blue)
        this.schedule.red = new TimeTable(red)
    }

    setMatchNumber(matchNumber)
    {
        this.matchNumber = matchNumber
        this.schedule.blue.setMatchNumber(matchNumber)
        this.schedule.red.setMatchNumber(matchNumber)
    }

    getSchedule(color)
    {
        return this.schedule[color].getSchedule()
    }

    getTimeTable(color)
    {
        return this.schedule[color]
    }
}

class TimeTable
{
    constructor(schedule)
    {
        this.matchNumber = 1
        this.schedule = schedule
    }

    setMatchNumber(matchNumber)
    {
        this.matchNumber = matchNumber
    }

    setSchedule(schedule)
    {
        this.schedule = schedule
    }

    getSchedule()
    {
        return this.schedule
    }

    getLineUp(matchNumber)
    {
        return this.schedule[matchNumber]
    }

    getCurrentLineUp()
    {
        return this.schedule[this.matchNumber]
    }

    getCurrentMatchLineUp()
    {
        let obj = {}
        obj[this.matchNumber] = this.schedule[this.matchNumber]
        return obj
    }

    getCurrentLineUpPosition(position)
    {
        return this.getCurrentLineUp()[position]
    }

    hasScouter(scout)
    {
        return this.schedule[this.matchNumber].includes(scout)
    }
}

class TimeSheet extends Event
{
    constructor(schedule)
    {
        super(schedule)
    }

    hasScouter(scout)
    {
        return this.schedule.blue.hasScouter(scout) || this.schedule.red.hasScouter(scout)
    }
}

class Team 
{
    constructor(scout, teamNumber, allianceColor, markerColor) 
    {
        this.scout = scout;
        this.teamNumber = teamNumber;
        this.idx = 0;
        this.allianceColor = allianceColor;
        this.markerColor = markerColor;
        this.gameState = [];
        this.teleopScore = new ref.ScoreBoard();
        this.autonScore = new ref.ScoreBoard();
        this.passes = 0;
        this.connection = false;
        this.onStage = false;
        this.mobile = false;
    }

    setMarkerColors(red, green, blue, alpha)
    {
        this.markerColor = new MarkerColor(red, green, blue, alpha)
    }

    setMarkerColor(markerColor)
    {
        this.markerColor = markerColor
    }

    connect() 
    {
        this.connection = true
    }

    disconnect() 
    {
        this.connection = false
    }

    isConnected() 
    {
        return this.connection
    }

    setTeamNumber(teamNumber)
    {
        this.teamNumber = teamNumber
    }

    getTeamNumber()
    {
        return this.teamNumber
    }

    hasTeamNumber() 
    {
        return this.teamNumber != ''
    }

    setGameState(index, gameState)
    {
        this.gameState = gameState
    }

    getGameState(index)
    {
        return this.gameState[index]
    }

    reset() 
    {
        this.teamNumber = ''
    }


    mobilize()
    {
        this.mobile = true
    }

    immobilize()
    {
        this.mobile = false
    }

    isMobile()
    {
        return this.mobile
    }

    setIdx(idx)
    {
        this.idx = idx
    }

}

class GameState 
{
    constructor() 
    {
        this.markerScore = 0;
        this.parkingScore = 0;
        this.parkingState = '';

    }

    getMarkerScore()
    {
        return this.markerScore
    }

    getParkingScore()
    {
        return this.parkingScore
    }

    getParkingState()
    {
        return this.parkingState
    }

    park() {
        this.parkingState = 'parked'
    }

    unpark() 
    {
        this.parkingState = ''
    }

    isParked()
    {
        return this.parkingState != ''
    }

    resetParking()
    {
        this.parkingScore = 0
        this.parkingState = ''
    }

    resetMarkers()
    {
        this.markerScore = 0
    }
}




//clean up
class GamePlay 
{
    constructor() 
    {
        this.gameState = ""
        this.isAmplified = false;
        this.teams = [];
        this.autonMarkers = {};
        this.telopMarkers = {};
        this.preGameMarkers = {};
        this.idx = 0;
        this.score = null;
        this.playingField = {};
        this.amplifierCounter = 0; //this is used to track how many amplifier notes are in the match
        this.speakerCounter = 0; // this is used to track how many speaker notes are in the match
        this.amplifiedCounter = 0; // this is used to track how many speaker notes are in the match
        this.passCounter = 0;
    }

    isPreGame()
    {
        return this.gameState == "pregame"
    }

    isAuton()
    {
        return this.gameState == "auton"
    }

    isTeleop()
    {
        return this.gameState == "teleop"
    }

    increment()
    {
        this.idx++
    }

    decrement()
    {
        this.idx--
    }

    getIdx()
    {
        return this.idx
    }

    setIdx(idx)
    {
        this.idx = idx
    }

    clearIdx(idx)
    {
        this.idx = 0
    }

    gameStateIndicator() 
    {
        switch (this.gameState) 
        {
            case "pregame":
                return 1
            case "auton": 
                return 0.8
            case "teleop":
                return 0.5
        }
    }

    switchGameState(gameStates, gameValue) 
    {
        let index = Number(gameValue)
        this.gameState = gameStates[index]
    }

    clearGameStates() 
    {
        for (let team of this.teams) 
        {
            team.gameState = []    
        }
    }

    getScouterCount() 
    {
        let scouterCount = 0
        for (let team of this.teams) 
        {
            if (team.isConnected()) 
            {
                scouterCount++
            }
        }
        return scouterCount
    }

    isFull() 
    {
        return this.getScouterCount() >= 3
    }

    addTeam(team) 
    {
        this.teams.push(new Team(team.scout, team.teamNumber, team.allianceColor, new MarkerColor(team.markerColor.red, team.markerColor.green, team.markerColor.blue, team.markerColor.alpha)))
    }

    findTeam(scout) //
    {
        return this.teams.find(item => item.scout === scout)
    }

    getActiveTeams()
    {
        let activeTeams = []
        for (let team of this.teams) 
        {
            if (team.isConnected()) 
            {
                activeTeams.push(team)
            }
        }
        return activeTeams

    }

    getTeamByScout(scout)
    {
        return this.teams.find(item => item.scout === scout)
    }

    getTeamByNumber(teamNumber)
    {
        return this.teams.find(item => item.teamNumber === teamNumber)
    }

    hasScouter(scout) 
    {
        return typeof(this.findTeam(scout)) == "object"
    }

    hasConnectedScouter(scout) 
    {
        if (this.hasScouter(scout)) 
        {
            return this.findTeam(scout).isConnected()
        }
        return false
    }

    getScouters() 
    {
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

    resetTeams() 
    {
        // reset the counters
        this.amplifierCounter = 0
        this.amplifiedCounter = 0
        this.speakerCounter = 0
        this.passCounter = 0
        this.isAmplified = false
        for (let team of this.teams) {
            team.teamNumber = ''
            team.autonScore = new ref.ScoreBoard();
            team.teleopScore = new ref.ScoreBoard();
        }
    }

    getMarkerState(markerId)
    {
        if (markerId in this.preGameMarkers) 
        {
            return "pregame"
        }
        else if (markerId in this.telopMarkers) 
        {
            return "teleop"
        } 
        else if (markerId in this.autonMarkers) 
        {
            return "auton"
        }
        return false
    }

    getPregameMarker(markerId) 
    {
        return this.preGameMarkers[markerId]
    }

    getAutonMarker(markerId) 
    {
        return this.autonMarkers[markerId]
    }

    getTelopMarker(markerId) 
    {
        return this.telopMarkers[markerId]
    }

    addAutonMarker(marker, markerId) 
    {
        this.autonMarkers[markerId] = marker
    }

    deleteAutonMarker(markerId) 
    {
        delete this.autonMarkers[markerId]
    }

    addTelopMarker(marker, markerId) 
    {
        this.telopMarkers[markerId] = marker
    }

    deleteTelopMarker(markerId) 
    {
        delete this.telopMarkers[markerId]
    }

    addPreGameMarker(marker, markerId) 
    {
        this.preGameMarkers[markerId] = marker
    }

    deletePreGameMarker(markerId) 
    {
        delete this.preGameMarkers[markerId]
    }

    deleteMarkers() 
    {
        this.preGameMarkers = {}
        this.autonMarkers = {}
        this.telopMarkers = {}
    }

    getPreGameMarkers()
    {
        return this.preGameMarkers
    }

    getTeleOpMarkers() 
    {
        return this.telopMarkers
    }

    getAutonMarkers() 
    {
        return this.autonMarkers
    }

    addMarker(marker, markerId) 
    {
        switch (marker.gameState) 
        {
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

    getMarker(markerId) 
    {
        switch(this.getMarkerState(markerId)) 
        {
            case "pregame":
                return this.getPregameMarker(markerId)
            case "auton":
                return this.getAutonMarker(markerId)
            case "teleop":
                return this.getTelopMarker(markerId)
        }
    }

    deleteMarker(markerId) 
    {
        switch (this.getMarkerState(markerId)) 
        {
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

    clickedItemField(markerId) 
    {
        let x = markerId.substring(markerId.indexOf('x') + 1, markerId.indexOf('y'))
        let y = markerId.substring(markerId.indexOf('y') + 1, markerId.length)
        return !!(x >= this.itemField.x && 
            x < (this.itemField.x + this.itemField.width) && 
            y >= this.itemField.y && 
            y < (this.itemField.y + this.itemField.height))
    }

    dockAll() 
    {
        for (let team of this.teams) 
        {
            team.dock()
        }
    }

    engageAll() 
    {
        for (let team of this.teams) 
        {
            team.engage()
        }
    }

    undockAll() 
    {
        for (let team of this.teams) 
        {
            team.undock()
        }
    }

    disengageAll() 
    {
        for (let team of this.teams) 
        {
            team.disengage()
        }
    }

    
    GetClickedFieldLocation(markerId, gameState)
    {
        let x = markerId.getX();
        let y = markerId.getY();
        let result = "";

        for (let location in this.playingField.field)
        {
            if(this.playingField.field[location].GameStates.find((element) => element === gameState))
            {
                let markerArray = this.playingField.field[location].Points;
                for (let coordinates in markerArray)
                {
                    if (markerArray[coordinates].x == x && markerArray[coordinates].y == y)
                    {
                        markerId.markerLocationCoordinates = this.playingField.field[location].MarkerLocationCoordinates;
                        markerId.markerRotation = this.playingField.field[location].MarkerRotation;
                        markerId.markerLocationType = location;
                        
                        markerId.isMarkedOnce = this.playingField.field[location].isMarkedOnce;
                        markerId.isSingleSpace = this.playingField.field[location].isSingleSpace;
                        markerId.GameState = gameState;
                        
                        //Added this to Crescendo to account for amplified notes. This is a subcategory of Speaker
                        if (this.playingField.field[location].MarkerType == 'Speaker' && this.isAmplified == true)
                        {
                            if (markerId.markerLocationType == 'SpeakerUndo') // handle if a amplified speaker is removed
                                markerId.markerLocationType = 'AmplifiedUndo'
                            
                            markerId.markerType = 'Amplified';
                        }
                        else
                            markerId.markerType = this.playingField.field[location].MarkerType;

                        
                        return this.playingField.field[location].MarkerType;
                    }
                }
            }
        }

        return result;
    }

    setMarkerType(markerId, currState, gameState)
    {
        
        let result = this.GetClickedFieldLocation(markerId, gameState);

      /*  if(this.clickedChargingStation(markerId) == true && currState == 'Docked')
        {
            return 'Engaged'
        }
        else if(this.clickedChargingStation(markerId) == true)
        {
            return 'Docked'
        }
        else if (gameState == 'auton' && !(this.clickedParkingField(markerId)) && !(this.clickedChargingStation(markerId)) && !(this.clickedItemField(markerId)))
        {
            return 'Mobile'
        }
        else if (gameState == 'teleop' && !(this.clickedParkingField(markerId)) && !(this.clickedChargingStation(markerId)) && !(this.clickedItemField(markerId)))
        {
            return 'OutOfBounds'
        }
        else if(this.clickedParkingField(markerId) == true)
        {
            return 'Parked'
        }*/

        return result;  
    }

    setAmplified(amplified)
    {
        this.isAmplified = amplified;
    }

    
}

class PlayingField{
    constructor(field) {
        this.field = field;
    }

    getFieldLocation(marker)
    {
        return null;
    }
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

class Match 
{
    constructor() 
    {
        this.matchNumber = '1'
        this.session = false
        this.startTime = ''
        this.autonStartTime = ''
       // this.scoreboard = {}
        this.gamePlay = {
            blue: {},
            red: {}
        }
        this.admin = false
    }

    setMatchNumber(matchNumber)
    {
        this.matchNumber = matchNumber
    }

    /*setScoreBoard(scoreboard)
    {
        this.scoreboard = scoreboard
    }*/

    open() 
    {
        this.session = true
    }

    start() 
    {
        this.startTime = (performance.now() / 1000)
    }

    autonStart() 
    {
        this.autonStartTime = (performance.now() / 1000)
    }

    inSession() 
    {
        return this.session
    }
    
    reset() 
    {
        this.session = false;
        this.startTime = '';
        this.autonStartTime = '';
    }

    connectAdmin() 
    {
        this.admin = true
    }

    disconnectAdmin() 
    {
        this.admin = false
    }

    hasScouter(scoutName) 
    {
        return (this.gamePlay.blue.hasScouter(scoutName) || this.gamePlay.red.hasScouter(scoutName))
    }

    hasConnectedScouter(scoutName) 
    {
        return (this.gamePlay.blue.hasConnectedScouter(scoutName) || this.gamePlay.red.hasConnectedScouter(scoutName))
    }

    hasAdmin() 
    {
        return this.admin
    }

    getGamePlay(color) 
    {
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

module.exports = {Field, Grid, MarkerColor, Team, Markers, User, GamePlay, ChargingStation, Match, ParkingField, GameState, ItemField, Event, TimeSheet, TimeTable, PlayingField}