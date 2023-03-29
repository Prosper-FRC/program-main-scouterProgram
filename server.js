let teamNumRed = 4
let teamNumBlue = 1
let teamIndex = {
    blue: "",
    red: ""
}

let assets = {
    blue: "../Assets/blueField.png",
    red: "../Assets/redField.png",
    blueAlt: "../Assets/blueField_alt.png",
    redAlt: "../Assets/redField_alt.png"
}

let field = {}
let grid = {}

const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const app = express()
//const io = require('socket.io')(5500)
const gp = require('./Server/gamePieces')
const ut = require('./Server/utility.js')
const fw = require('./Server/fileWriter')
const ref = require('./Server/referee') 
//const start = performance.now();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const http = require("http")
const socketio = require("socket.io")
const path = require("path")
const httpserver = http.Server(app)
const io = socketio(httpserver)

const sessionMiddleware = session({
    secret: "54119105",
    saveUninitialized: false,
    //cookie: { maxAge: 3600000 },
    resave: false
})

app.use(sessionMiddleware)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

express.static('public');
app.use(express.static(__dirname + "/Rooms"))

app.post('/scoutdata', (req, res) => {
    let scoutData = fw.getScoutData()
    res.json(scoutData)
})

app.post("/signin", (req, res) => {
    if (req.body.username == "") 
    {
        res.send(ut.notification("Please choose a scouter."))
    } 
    else if (req.body.password != "password")
    {
        res.send(ut.notification("That password is incorrect"))
    }
    else if (match.hasConnectedScouter(req.body.username))
    {
        res.send(ut.notification('Sorry, but somebody already joined under that name.'))
    }
    else if (req.body.username == "admin") 
    {
        req.session.authenticated = true
        req.session.scout = "admin"
        match.connectAdmin()
        res.redirect('/admin')
    } 
    else if (match.getGamePlay(fw.getAllianceColor(req.body.username)).isFull()) 
    {
        res.send(ut.notification('Sorry, but the session you are trying to join is full.'))
    }
    else if (match.inSession() && !(competition.blue.hasScouter(match.matchNumber, req.body.username) || competition.red.hasScouter(match.matchNumber, req.body.username)))
    {
        res.send(ut.notification('Sorry, but you are not scheduled for this match.'))
    }
    else if (match.inSession() && fw.getAllianceColor(req.body.username) && match.hasAdmin())
    {
        req.session.authenticated = true
        req.session.scout = req.body.username
        req.session.allianceColor = fw.getAllianceColor(req.body.username)
        res.redirect('/' + req.session.allianceColor)
    } 
    else if (!match.hasAdmin()) 
    {
        res.send(ut.notification('The admin has not joined yet, please be patient'))
    } 
    else if (!match.inSession()) 
    {
        res.send(ut.notification('The admin has not started the match yet, please be patient.'))
    } 
    else 
    {
        res.send(ut.notification('Sorry, but that name was not found on the scouter list.'))
    }
})

app.post('/schedule/blue', (req, res) => {
    let table = new ut.JsonTable(competition.blue.schedule)
    res.json(table.json())
})

app.post('/schedule/red', (req, res) => {
    let table = new ut.JsonTable(competition.red.schedule)
    res.json(table.json())
})

app.post('/ondeck/blue', (req, res) => {
    let obj = {}
    obj[match.matchNumber] = competition.blue.schedule[match.matchNumber]
    let table = new ut.JsonTable(obj)
    res.json(table.json())
})

app.post('/ondeck/red', (req, res) => {
    let obj = {}
    obj[match.matchNumber] = competition.red.schedule[match.matchNumber]
    let table = new ut.JsonTable(obj)
    res.json(table.json())
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/lobby')
})

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/index.html'))
})

app.get('/blue', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/blue/index.html'))
})

app.get('/red', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/red/red.html'))
})

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/admin/admin.html'))
})

app.get('/lobby', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/lobby/lobby.html'))
})

app.get('*', function(req, res) {
    res.redirect('/lobby')
})

let playerPos = {}
let match = {}
let score = {}
let competition = {
    blue: {},
    red: {}
}

const gameStates = ["pregame", "auton", "teleop"]
let matchData = {}

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
        next();
    } else {
        console.log("unauthorized user joined")
    }
})


initGame()

io.on('connection', connected);

function connected(socket) {

    const session = socket.request.session
    let allianceGamePlay
    let team

    if (session.allianceColor) 
    {
        //allianceGamePlay = match.gamePlay[session.allianceColor]
        allianceGamePlay = match.getGamePlay(session.allianceColor)
        team = allianceGamePlay.findTeam(session.scout)
    } 

    //console.log(session)
    //console.log("session id: " + socket.request.session.id + "\n")
    //console.log("scout name: " + socket.request.session.scout + "\n")

    socket.on('newScouter', data => {

        socket.leaveAll()
        socket.join(session.allianceColor)

        console.log("New client connected, with id (yeah): " + socket.id)

        if (!team.hasTeamNumber()) 
        {
            team.teamNumber = matchData[match.matchNumber][team.allianceColor][teamIndex[team.allianceColor]].slice(3)
            teamIndex[team.allianceColor]++
            if(team.allianceColor == 'red')
            {
                team.idx = teamNumRed
                teamNumRed++
            }
            else
            {
                team.idx = teamNumBlue
                teamNumBlue++
            }
            
        }

        team.connect()
        team.gameState[allianceGamePlay.gameState] = new gp.GameState()

        socket.emit('rotate', field[team.allianceColor].getRotation())

        socket.emit('drawfield', field[team.allianceColor].getDimensions(), grid[team.allianceColor].getDimensions())

        socket.emit('AssignRobot', team)
        io.to('admin').emit('AssignRobot', team)

        //to do: fix this so that it only renders game markers on the newly joined client instead of re-drawing everyone's fields
        io.to(team.allianceColor).emit('clear')

        io.to(team.allianceColor).emit('draw', allianceGamePlay.preGameMarkers)
        io.to(team.allianceColor).emit('draw', allianceGamePlay.autonMarkers)
        io.to(team.allianceColor).emit('draw', allianceGamePlay.telopMarkers)
    })

    socket.on('setMatch', matchNumber => {
        match.matchNumber = matchNumber
        match.open()
        if (fw.fileExists(("match" + matchNumber))) {
            io.to('admin').emit('confirm')
        } else {
            fw.addNewGame("match" + match.matchNumber)
        }
    })

    socket.on('start', () => {
        teamNumRed = 4
        TeamNumBlue = 1
        teamIndex.blue = 0
        teamIndex.red = 0

        console.log("match " + match.matchNumber + " is starting")
        match.start()
    })

    socket.on('newAdmin', data => {
        socket.leaveAll()
        socket.join("admin")

        let compLength = (Object.keys(fw.getMatchData())).at(-1)
        io.to('admin').emit('compLength', compLength)

        for (team of match.gamePlay.blue.teams) 
        {
            if (team.isConnected()) 
            {
                io.to('admin').emit('AssignRobot', team)
            }
        }
        
        for (team of match.gamePlay.red.teams) 
        {
            if (team.isConnected()) 
            {
                io.to('admin').emit('AssignRobot', team)
            }
        }

        io.to('admin').emit('rotate', field.blue.getRotation())

        io.to('admin').emit('drawfield', 'blue', field.blue.getDimensions(), grid.blue.getDimensions())
        io.to('admin').emit('drawfield', 'red', field.red.getDimensions(), grid.red.getDimensions())

        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.preGameMarkers)
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.autonMarkers)
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.telopMarkers)

        io.to('admin').emit('draw', 'red', match.gamePlay.red.preGameMarkers)
        io.to('admin').emit('draw', 'red', match.gamePlay.red.autonMarkers)
        io.to('admin').emit('draw', 'red', match.gamePlay.red.telopMarkers)

        io.to('admin').emit('schedule', competition.blue.schedule, competition.red.schedule)
    })

    socket.on('flip', () => 
    {
        let style = {}
        if (field.blue.isFlipped())
        {
            field.blue.flip()
            field.red.flip()
            
            field.blue.rotate("0deg")
            field.red.rotate("0deg")

            field.blue.bg = assets.blue
            field.red.bg = assets.red

            style.direction = "row"
            style.alignment = "flex-start"
            style.order = "1"
        } 
        else
        {
            field.blue.flip()
            field.red.flip()

            field.blue.rotate("180deg")
            field.red.rotate("180deg")

            field.blue.bg = assets.blueAlt
            field.red.bg = assets.redAlt

            style.direction = "row-reverse"
            style.alignment = "flex-end"
            style.order = "-1"
        }

        io.to('admin').emit('restyle', style)

        io.to('admin').emit('rotate', field.blue.getRotation())
        io.to('blue').emit('rotate', field.blue.getRotation())
        io.to('red').emit('rotate', field.red.getRotation())

        io.to('admin').emit('drawfield', 'blue', field.blue.getDimensions(), grid.blue.getDimensions())
        io.to('admin').emit('drawfield', 'red', field.red.getDimensions(), grid.red.getDimensions())
        io.to('blue').emit('drawfield', field.blue.getDimensions(), grid.blue.getDimensions())
        io.to('red').emit('drawfield', field.red.getDimensions(), grid.red.getDimensions())
    })

    socket.on('saveSchedule', (color, schedule) => {
        competition[color].schedule = schedule
        fw.saveBreakSchedule(color, competition[color])
    })

    socket.on('drawMarker', (allianceColor, data) => {

        if (session.scout == "admin") 
        {
            //allianceGamePlay = match.gamePlay[allianceColor]
            allianceGamePlay = match.getGamePlay(allianceColor)
            team = allianceGamePlay.findTeam(session.scout)
        }
        
        if (!team.gameState[allianceGamePlay.gameState])
            team.gameState[allianceGamePlay.gameState] = new gp.GameState()
        

        team.markerColor.alpha = allianceGamePlay.gameStateIndicator()
        
        let drawMarker = new gp.Markers(data.x, data.y)
        let markerId = "x" + drawMarker.x + "y" + drawMarker.y

        if (!(allianceGamePlay.findMarker(markerId)) ) {
            //console.log(score);

            drawMarker.markerColor = new gp.MarkerColor(
                team.markerColor.red,
                team.markerColor.green,
                team.markerColor.blue,
                allianceGamePlay.gameStateIndicator()
            )
            drawMarker.gameState = allianceGamePlay.gameState
            drawMarker.teamNumber = team.teamNumber
            drawMarker.markerType = allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState, allianceGamePlay.gameState)

            // don't draw markers during pregame
            if(allianceGamePlay.gameState == 'pregame' && session.scout == "admin")
            {
                allianceGamePlay.addPreGameMarker(drawMarker, markerId)
                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            } 
            else if (allianceGamePlay.gameState == 'pregame') 
            {
                //Ignore Marker
            } 
            else if(drawMarker.markerType == 'Parked' && allianceGamePlay.gameState == 'auton') // parking isn't scored during auton only docking and engaging
            {
                //Ignore Marker
            }
            else if (drawMarker.markerType == 'OutOfBounds')
            {
                //Ignore Marker
            }
            // Check to see if the robot is already parked and don't accept the marker
            else if(drawMarker.markerType != 'Item' && team.gameState[allianceGamePlay.gameState].parkingState != '')
            {
                //Ignore Marker
            }
            else
            {
                allianceGamePlay.addMarker(drawMarker, markerId)

                //create time stamp
                //CreateTimeStamp(markerId, allianceColor)
                drawMarker.createTimeStamp(match.startTime)

                if (allianceGamePlay.clickedChargingStation(markerId)) 
                {
                    allianceGamePlay.chargingStation.dock()
                    team.dock()
                }

                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            }

        } else if (allianceGamePlay.clickedChargingStation(markerId) && !(team.engaged) && (allianceGamePlay.getMarker(markerId).teamNumber == team.teamNumber)) {

            allianceGamePlay.chargingStation.engage()
            team.engage()

            drawMarker = allianceGamePlay.getMarker(markerId)
            drawMarker.markerColor = new gp.MarkerColor(
                team.markerColor.red,
                team.markerColor.green,
                team.markerColor.blue,
                allianceGamePlay.gameStateIndicator() * 2
            )
            drawMarker.gameState = allianceGamePlay.gameState
            drawMarker.teamNumber = team.teamNumber
            drawMarker.markerType = allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState)
            drawMarker.createTimeStamp(match.autonStartTime)

            io.to(team.allianceColor).emit('placeMarker', drawMarker)
            io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)

        } else if (allianceGamePlay.getMarker(markerId).teamNumber == team.teamNumber) {

            if (allianceGamePlay.clickedChargingStation(markerId)) 
            {
                team.disengage()
                team.undock()
                allianceGamePlay.chargingStation.disengage()
                allianceGamePlay.chargingStation.undock()
            }

            if(allianceGamePlay.getMarker(markerId).markerType != 'Item')
            {
                team.gameState[allianceGamePlay.gameState].parkingScore = 0;
                team.gameState[allianceGamePlay.gameState].parkingState = '';
            }

            io.to(team.allianceColor).emit('clear')
            io.to('admin').emit('clear', team.allianceColor)

            allianceGamePlay.deleteMarker(markerId)
            
            //delete time stamp
            //DeleteTimeStamp(markerId);
            
            io.to(team.allianceColor).emit('draw', allianceGamePlay.preGameMarkers)
            io.to(team.allianceColor).emit('draw', allianceGamePlay.autonMarkers)
            io.to(team.allianceColor).emit('draw', allianceGamePlay.telopMarkers)

            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.preGameMarkers)
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.autonMarkers)
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.telopMarkers)
        }

        // scoring compoentents here 
        try{
        score.UpdateMarkers(match.gamePlay["blue"].ReturnTeleOpMarkers(), match.gamePlay["red"].ReturnTeleOpMarkers(), match.gamePlay["blue"].ReturnAutonMarkers(), match.gamePlay["red"].ReturnAutonMarkers(), team.teamNumber, team);
      //  console.log("Blue:" + score.TeamScore("blue"));
     //   console.log("Red: " + score.TeamScore("red"));
        } catch (err)
        {
            console.log(err);
        }
        let autonScore = {}
        let teleopScore = {}
        if(team.gameState['auton'])
        {
            autonScore = team.gameState['auton']
            team.autonScore = autonScore;
        }
        if(team.gameState['teleop'])
        {
            teleopScore = team.gameState['teleop']
            team.teleopScore = teleopScore;
        }

        let ScoreBoard = {totalScore: score.GetBoard(), team: team, autonScore: autonScore, teleopScore: teleopScore, startTime: match.startTime};
        io.to(team.allianceColor).emit('scoreboard', ScoreBoard)
        io.to('admin').emit('scoreboard', ScoreBoard, team.scout)

        //console.log(timeStamps)

        match.scoreboard = ScoreBoard;
        team.gameStateScore = JSON.stringify(team.gameState);
        //let saveMatch  = {matchNumber: match.matchNumber, scoreboard: match.scoreboard, }
        fw.saveScoreData(match)
    })

    socket.on('gameChange', (allianceColor, value) => {
        //allianceGamePlay = match.gamePlay[allianceColor]
        allianceGamePlay = match.getGamePlay(allianceColor)
        allianceGamePlay.switchGameState(gameStates, value)

        allianceGamePlay.undockAll()
        allianceGamePlay.disengageAll()
        allianceGamePlay.chargingStation.reset()

        if(value === 'auton') 
            match.autonStart()


        console.log("the game mode for " + allianceColor + " is now set to " + allianceGamePlay.gameState)
        socket.emit('toggleGameMode', allianceColor)
        socket.emit('returnGameState', allianceGamePlay.gameState)
    })

    socket.on('scoutChange', scout => {
        if (match.gamePlay.blue.hasScouter(scout)) 
        {
            match.gamePlay.blue.findTeam(session.scout).teamNumber = match.gamePlay.blue.findTeam(scout).teamNumber
            match.gamePlay.blue.findTeam(session.scout).markerColor = match.gamePlay.blue.findTeam(scout).markerColor
        } 
        else if (match.gamePlay.red.hasScouter(scout)) 
        {
            match.gamePlay.red.findTeam(session.scout).teamNumber = match.gamePlay.red.findTeam(scout).teamNumber
            match.gamePlay.red.findTeam(session.scout).markerColor = match.gamePlay.red.findTeam(scout).markerColor
        }
    })

    socket.on('adminChange', () => {
        match.gamePlay.blue.findTeam(session.scout).reset()
        match.gamePlay.blue.findTeam(session.scout).markerColor = new gp.MarkerColor(25, 25, 25, 0.5)

        match.gamePlay.red.findTeam(session.scout).reset()
        match.gamePlay.red.findTeam(session.scout).markerColor = new gp.MarkerColor(25, 25, 25, 0.5)
    })

    socket.on('endMatch', () => {
        match.gamePlay.blue.clearGameStates()
        match.gamePlay.red.clearGameStates()

        match.gamePlay.blue.deleteMarkers()
        match.gamePlay.red.deleteMarkers()

        match.gamePlay.blue.undockAll()
        match.gamePlay.blue.disengageAll()
        match.gamePlay.red.undockAll()
        match.gamePlay.red.disengageAll()
        
        match.gamePlay.blue.chargingStation.reset()
        match.gamePlay.red.chargingStation.reset()

        match.gamePlay.blue.resetTeams()
        match.gamePlay.red.resetTeams()

        match.reset()

        io.to('blue').emit('gameOver')
        io.to('red').emit('gameOver')

        io.to('blue').emit('clear')
        io.to('red').emit('clear')

        io.to('admin').emit('clear', 'blue')
        io.to('admin').emit('clear', 'red')
    })

    socket.on('disconnect', () => {
        console.log("Goodbye client with id " + socket.id);
        console.log("Current number of players: " + Object.keys(playerPos).length);

        //team.teamNumber = ''
        if (session.scout == "admin") 
        {
            match.disconnectAdmin()
            //match.reset() 
            // ^this completely halts the match if the admin disconnects. haven't seen a need to use it yet though, but uncomment it if necessary
            // note that resetting the match upon admin disconnection messes with data collection if a match is still in session
        } 
        else 
        {
            team.disconnect()
        }

        io.to('admin').emit('disconnected', team)
    })

    socket.on('gameState', allianceColor => {
        //allianceGamePlay = match.gamePlay[allianceColor]
        allianceGamePlay = match.getGamePlay(allianceColor)
        socket.emit('returnGameState', allianceGamePlay.gameState)
    })

}

function initGame()
{
    teamNum = 1
    teamIndex.blue = 0
    teamIndex.red = 0

    competition.blue = new gp.Event(100) //to do: edit it so that the parameter corresponds with the number of event matches
    competition.red = new gp.Event(100)

    const data = fw.getScoutData()
    score = new ref.ScoreLive()

    match = new gp.Match()
    match.gamePlay.blue = new gp.GamePlay()
    match.gamePlay.red = new gp.GamePlay()

    for (let scout in data.blue) {

        match.gamePlay.blue.addTeam(
            new gp.Team(
                data.blue[scout].name, 
                '', 
                'blue', 
                new gp.MarkerColor(
                    Number(data.blue[scout].color.red), 
                    Number(data.blue[scout].color.green), 
                    Number(data.blue[scout].color.blue), 
                    1
                )
            )
        )

    }

    for (let scout in data.red) {

        match.gamePlay.red.addTeam(
            new gp.Team(
                data.red[scout].name,  
                '',
                'red', 
                new gp.MarkerColor(
                    Number(data.red[scout].color.red), 
                    Number(data.red[scout].color.green), 
                    Number(data.red[scout].color.blue), 
                    1
                )
            )
        )
        
    }
    
    match.gamePlay.blue.addTeam(
        new gp.Team(
            data.admin.name, 
            '', 
            'blue', 
            new gp.MarkerColor(
                Number(data.admin.color.red), 
                Number(data.admin.color.green), 
                Number(data.admin.color.blue), 
                1
            )
        )
    )

    match.gamePlay.red.addTeam(
        new gp.Team(
            data.admin.name, 
            '', 
            'red', 
            new gp.MarkerColor(
                Number(data.admin.color.red), 
                Number(data.admin.color.green), 
                Number(data.admin.color.blue), 
                1
            )
        )
    )

    competition.blue.createSchedule(match.gamePlay.blue.getScouters())
    competition.red.createSchedule(match.gamePlay.red.getScouters())

    fw.saveBreakSchedule("blue", competition.blue)
    fw.saveBreakSchedule("red", competition.red)

    match.gamePlay.blue.gameState = "pregame"
    match.gamePlay.red.gameState = "pregame"

    match.gamePlay.blue.chargingStation = new gp.ChargingStation(7, 5, 4, 5)
    match.gamePlay.red.chargingStation = new gp.ChargingStation(4, 5, 3, 5)
    match.gamePlay.blue.parkingField = new gp.ParkingField(3,3,4,7,3,9,7,2)
    match.gamePlay.red.parkingField = new gp.ParkingField(7,3,4,7,4,10,7,2)
    match.gamePlay.blue.itemField = new gp.ItemField(0,3,3,9)
    match.gamePlay.red.itemField = new gp.ItemField(11,3,3,9)
    
    matchData = fw.getMatchData()

    field.blue = new gp.Field(assets.blue, 775, 820)
    field.red = new gp.Field(assets.red, 775, 820)

    grid.blue = new gp.Grid(field.blue.width, field.blue.height, 55, 68)
    grid.red = new gp.Grid(field.red.width, field.red.height, 55, 68)
}

httpserver.listen(5500)